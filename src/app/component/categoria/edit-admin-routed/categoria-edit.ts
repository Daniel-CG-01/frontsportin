import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../service/categoria';
import { TemporadaService } from '../../../service/temporada';
import { MatDialog } from '@angular/material/dialog';
import { TemporadaPlistAdminUnrouted } from '../../temporada/plist-admin-unrouted/temporada-plist-admin-unrouted';
import { ICategoria } from '../../../model/categoria';
import { ITemporada } from '../../../model/temporada';

@Component({
  selector: 'app-categoria-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-edit.html',
  styleUrl: './categoria-edit.css',
})
export class CategoriaEditAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oCategoriaService = inject(CategoriaService);
  private oTemporadaService = inject(TemporadaService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  categoriaForm!: FormGroup;
  id_categoria = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  temporadas = signal<ITemporada[]>([]);
  selectedTemporada = signal<ITemporada | null>(null);
  displayIdTemporada = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.loadTemporadas();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de categoría no válido');
      this.loading.set(false);
      return;
    }

    this.id_categoria.set(Number(idParam));

    if (isNaN(this.id_categoria())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadCategoria();
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      id_temporada: [null, Validators.required]
    });
  }

  private loadCategoria(): void {
    this.oCategoriaService.get(this.id_categoria()).subscribe({
      next: (categoria: ICategoria) => {
        this.categoriaForm.patchValue({
          id: categoria.id,
          nombre: categoria.nombre,
          id_temporada: categoria.temporada?.id
        });
        if (categoria.temporada) {
          // sincronizar la temporada seleccionada con la lista / carga individual
          this.syncTemporada(categoria.temporada.id);
        }
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la categoría');
        this.snackBar.open('Error cargando la categoría', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private loadTemporada(id: number): void {
    // mantenido por compatibilidad pero delegado a syncTemporada
    this.syncTemporada(id);
  }

  private syncTemporada(id: number): void {
    // Igual que Temporada.syncClub: solicitar la temporada y asignarla
    this.oTemporadaService.get(id).subscribe({
      next: (temporada) => {
        this.selectedTemporada.set(temporada);
        this.displayIdTemporada.set(temporada.id);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al sincronizar temporada:', err);
        this.snackBar.open('Error al cargar la temporada seleccionada', 'Cerrar', { duration: 3000 });
        this.selectedTemporada.set(null);
        this.displayIdTemporada.set(null);
      }
    });
  }

  openTemporadaFinderModal(): void {
    const dialogRef = this.dialog.open(TemporadaPlistAdminUnrouted, {
      height: '800px',
      width: '1100px',
      maxWidth: '95vw',
      panelClass: 'temporada-dialog',
      data: {
        title: 'Elige una temporada',
        message: 'Plist finder para encontrar la temporada y asignarla a la categoría',
      },
    });

    dialogRef.afterClosed().subscribe((temporada: ITemporada | null) => {
      if (temporada) {
        this.categoriaForm.patchValue({
          id_temporada: temporada.id,
        });
        // sincronizar explícitamente después de seleccionar desde el modal
        this.syncTemporada(temporada.id);
        this.snackBar.open(`Temporada seleccionada: ${temporada.descripcion}`, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  private loadTemporadas(): void {
    this.oTemporadaService.getPage(0, 1000, 'descripcion', 'asc', '', 0).subscribe({
      next: (page) => {
        this.temporadas.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando temporadas', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  get nombre() {
    return this.categoriaForm.get('nombre');
  }

  get id_temporada() {
    return this.categoriaForm.get('id_temporada');
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', { duration: 4000 });
      return;
    }

    this.submitting.set(true);

    const categoriaData: any = {
      id: this.id_categoria(),
      nombre: this.categoriaForm.value.nombre,
      temporada: { id: this.categoriaForm.value.id_temporada }
    };

    this.oCategoriaService.update(categoriaData).subscribe({
      next: () => {
        this.snackBar.open('Categoría actualizada exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/categoria']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando la categoría');
        this.snackBar.open('Error actualizando la categoría', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      }
    });
  }
}
