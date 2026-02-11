import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PuntuacionService } from '../../../service/puntuacion';
import { NoticiaService } from '../../../service/noticia';
import { UsuarioService } from '../../../service/usuarioService';
import { IPuntuacion } from '../../../model/puntuacion';
import { INoticia } from '../../../model/noticia';
import { IUsuario } from '../../../model/usuario';

@Component({
  selector: 'app-puntuacion-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './puntuacion-edit.html',
  styleUrl: './puntuacion-edit.css',
})
export class PuntuacionEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oPuntuacionService = inject(PuntuacionService);
  private oNoticiaService = inject(NoticiaService);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);

  puntuacionForm!: FormGroup;
  id_puntuacion = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  noticias = signal<INoticia[]>([]);
  usuarios = signal<IUsuario[]>([]);
  selectedNoticia = signal<INoticia | null>(null);
  selectedUsuario = signal<IUsuario | null>(null);
  displayIdNoticia = signal<number | null>(null);
  displayIdUsuario = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadNoticias();
    this.loadUsuarios();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de puntuación no válido');
      this.loading.set(false);
      return;
    }

    this.id_puntuacion.set(Number(idParam));

    if (isNaN(this.id_puntuacion())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadPuntuacion();
  }

  private initForm(): void {
    this.puntuacionForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      puntuacion: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      id_noticia: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });

    this.puntuacionForm.get('id_noticia')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncNoticia(id);
      }
    });

    this.puntuacionForm.get('id_usuario')?.valueChanges.subscribe((id) => {
      if (id) {
        this.syncUsuario(id);
      }
    });
  }

  private loadPuntuacion(): void {
    this.oPuntuacionService.get(this.id_puntuacion()).subscribe({
      next: (puntuacion: IPuntuacion) => {
        this.puntuacionForm.patchValue({
          id: puntuacion.id,
          puntuacion: puntuacion.puntuacion,
          id_noticia: puntuacion.noticia?.id,
          id_usuario: puntuacion.usuario?.id,
        });
        if (puntuacion.noticia?.id) {
          this.syncNoticia(puntuacion.noticia.id);
        }
        if (puntuacion.usuario?.id) {
          this.syncUsuario(puntuacion.usuario.id);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la puntuación');
        this.snackBar.open('Error cargando la puntuación', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private loadNoticias(): void {
    this.oNoticiaService.getPage(0, 1000, 'titulo', 'asc', '', 0).subscribe({
      next: (page) => {
        this.noticias.set(page.content);
        const idActual = this.puntuacionForm.get('id_noticia')?.value;
        if (idActual) {
          this.syncNoticia(idActual);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando noticias', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc', '', 0, 0, 0).subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
        const idActual = this.puntuacionForm.get('id_usuario')?.value;
        if (idActual) {
          this.syncUsuario(idActual);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private syncNoticia(idNoticia: number): void {
    this.displayIdNoticia.set(idNoticia);
    const seleccionada = this.noticias().find((n) => n.id === idNoticia) || null;
    this.selectedNoticia.set(seleccionada);
  }

  private syncUsuario(idUsuario: number): void {
    this.displayIdUsuario.set(idUsuario);
    const seleccionado = this.usuarios().find((u) => u.id === idUsuario) || null;
    this.selectedUsuario.set(seleccionado);
  }

  get puntuacion() {
    return this.puntuacionForm.get('puntuacion');
  }

  get id_noticia() {
    return this.puntuacionForm.get('id_noticia');
  }

  get id_usuario() {
    return this.puntuacionForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.puntuacionForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const puntuacionData: any = {
      id: this.id_puntuacion(),
      puntuacion: this.puntuacionForm.value.puntuacion,
      noticia: { id: this.puntuacionForm.value.id_noticia },
      usuario: { id: this.puntuacionForm.value.id_usuario },
    };

    this.oPuntuacionService.update(puntuacionData).subscribe({
      next: () => {
        this.snackBar.open('Puntuación actualizada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/puntuacion']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando la puntuación');
        this.snackBar.open('Error actualizando la puntuación', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}
