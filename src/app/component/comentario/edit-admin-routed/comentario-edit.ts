import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComentarioService } from '../../../service/comentario';
import { IComentario } from '../../../model/comentario';
import { UsuarioPlistAdminUnrouted } from '../../usuario/plist-admin-unrouted/usuario-plist-admin-unrouted';
import { NoticiaPlistAdminUnrouted } from '../../noticia/plist-admin-unrouted/noticia-plist-admin-unrouted';
import { UsuarioService } from '../../../service/usuarioService';
import { NoticiaService } from '../../../service/noticia';
import { IUsuario } from '../../../model/usuario';
import { INoticia } from '../../../model/noticia';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-comentario-edit-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comentario-edit.html',
  styleUrl: './comentario-edit.css',
})
export class ComentarioEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oComentarioService = inject(ComentarioService);
  private oUsuarioService = inject(UsuarioService);
  private oNoticiaService = inject(NoticiaService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  comentarioForm!: FormGroup;
  id_comentario = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  selectedUsuario = signal<IUsuario | null>(null);
  selectedNoticia = signal<INoticia | null>(null);

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de comentario no válido');
      this.loading.set(false);
      return;
    }

    this.id_comentario.set(Number(idParam));

    if (isNaN(this.id_comentario())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadComentario();
  }

  private initForm(): void {
    this.comentarioForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      id_usuario: [null, [Validators.required]],
      id_noticia: [null, [Validators.required]],
    });
  }

  private loadComentario(): void {
    this.oComentarioService.get(this.id_comentario()).subscribe({
      next: (comentario: IComentario) => {
        this.comentarioForm.patchValue({
          id: comentario.id,
          contenido: comentario.contenido ?? '',
          id_usuario: comentario.usuario?.id ?? null,
          id_noticia: comentario.noticia?.id ?? null,
        });
        // sincronizar claves foráneas para mostrar información relacionada
        if (comentario.usuario?.id) {
          this.syncUsuario(comentario.usuario.id);
        }
        if (comentario.noticia?.id) {
          this.syncNoticia(comentario.noticia.id);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.snackBar.open('Error cargando el comentario', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.comentarioForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const id_usuario = Number(this.comentarioForm.value.id_usuario);
    const id_noticia = Number(this.comentarioForm.value.id_noticia);

    // Validar que las claves foráneas existen antes de enviar
    forkJoin({
      usuario: this.oUsuarioService.get(id_usuario),
      noticia: this.oNoticiaService.getById(id_noticia),
    }).subscribe({
      next: () => {
        const comentarioData: IComentario = {
          id: this.id_comentario(),
          contenido: this.comentarioForm.value.contenido,
          usuario: { id: id_usuario } as any,
          noticia: { id: id_noticia } as any,
        };

        this.oComentarioService.update(comentarioData).subscribe({
          next: () => {
            this.snackBar.open('Comentario actualizado exitosamente', 'Cerrar', { duration: 4000 });
            this.submitting.set(false);
            this.router.navigate(['/comentario']);
          },
          error: (err: HttpErrorResponse) => {
            this.error.set('Error actualizando el comentario');
            this.snackBar.open('Error actualizando el comentario', 'Cerrar', { duration: 4000 });
            console.error(err);
            this.submitting.set(false);
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.error.set('Usuario o noticia no válidos. Verifique los IDs indicados.');
        this.snackBar.open('Usuario o noticia no válidos. Verifique los IDs.', 'Cerrar', { duration: 5000 });
        console.error(err);
      },
    });
  }

  private syncUsuario(idUsuario: number): void {
    this.oUsuarioService.get(idUsuario).subscribe({
      next: (usuario: IUsuario) => {
        this.selectedUsuario.set(usuario);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al sincronizar usuario:', err);
        this.snackBar.open('Error al cargar el usuario seleccionado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private syncNoticia(idNoticia: number): void {
    this.oNoticiaService.getById(idNoticia).subscribe({
      next: (noticia: INoticia) => {
        this.selectedNoticia.set(noticia);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al sincronizar noticia:', err);
        this.snackBar.open('Error al cargar la noticia seleccionada', 'Cerrar', { duration: 3000 });
      },
    });
  }

  openUsuarioFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlistAdminUnrouted, {
      height: '800px',
      width: '1300px',
      maxWidth: '95vw',
      panelClass: 'usuario-dialog',
      data: {
        title: 'Elegir usuario',
        message: 'Seleccione el usuario para el comentario',
      },
    });

    dialogRef.afterClosed().subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.comentarioForm.patchValue({ id_usuario: usuario.id });
        this.syncUsuario(usuario.id);
        this.snackBar.open(`Usuario seleccionado: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  openNoticiaFinderModal(): void {
    const dialogRef = this.dialog.open(NoticiaPlistAdminUnrouted, {
      height: '800px',
      width: '1300px',
      maxWidth: '95vw',
      panelClass: 'noticia-dialog',
      data: {
        title: 'Elegir noticia',
        message: 'Seleccione la noticia para el comentario',
      },
    });

    dialogRef.afterClosed().subscribe((noticia: INoticia | null) => {
      if (noticia) {
        this.comentarioForm.patchValue({ id_noticia: noticia.id });
        this.syncNoticia(noticia.id);
        this.snackBar.open(`Noticia seleccionada: ${noticia.titulo}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  get contenido() {
    return this.comentarioForm.get('contenido');
  }

  get id_usuario() {
    return this.comentarioForm.get('id_usuario');
  }

  get id_noticia() {
    return this.comentarioForm.get('id_noticia');
  }
}