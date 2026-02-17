import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LigaService } from '../../../service/liga';
import { EquipoService } from '../../../service/equipo';
import { ILiga } from '../../../model/liga';
import { IEquipo } from '../../../model/equipo';
import { EquipoPlistAdminUnrouted } from '../../equipo/plist-admin-unrouted/equipo-plist-admin-unrouted';
import { IPage } from '../../../model/plist';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-liga-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liga-edit.html',
  styleUrl: './liga-edit.css',
})
export class LigaEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oLigaService = inject(LigaService);
  private oEquipoService = inject(EquipoService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  idLiga = signal<number>(0);
  loadingLiga = signal(true);
  loadingEquipos = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  ligaForm!: FormGroup;
  equipos = signal<IEquipo[]>([]);
  selectedEquipo = signal<IEquipo | null>(null);
  displayIdEquipo = signal<number | null>(null);

  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    // Inicializar el formulario
    this.ligaForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      id_equipo: [null, [Validators.required]],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.idLiga.set(idParam ? Number(idParam) : NaN);
    
    if (isNaN(this.idLiga())) {
      this.error.set('ID no válido');
      this.loadingLiga.set(false);
      this.loadingEquipos.set(false);
      return;
    }
    
    this.loadLiga(this.idLiga());
    this.loadEquipos();
  }

  // Getters para facilitar el acceso a los controles del formulario
  get nombre() {
    return this.ligaForm.get('nombre');
  }

  get id_equipo() {
    return this.ligaForm.get('id_equipo');
  }

  loadLiga(id: number) {
    this.oLigaService.get(id).subscribe({
      next: (data: ILiga) => {
        // Extraer el ID del equipo
        const equipo: any = data.equipo;
        let equipoId: number | null = null;
        
        if (typeof equipo === 'number') {
          equipoId = equipo;
        } else if (equipo && equipo.id !== undefined && equipo.id !== null) {
          equipoId = Number(equipo.id);
        }

        // Actualizar el formulario con los datos de la liga
        this.ligaForm.patchValue({
          id: data.id,
          nombre: data.nombre ?? '',
          id_equipo: equipoId,
        });

        if (equipoId) {
          this.syncEquipo(equipoId);
        }

        this.loadingLiga.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la liga');
        this.loadingLiga.set(false);
        this.snackBar.open('Error cargando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  loadEquipos() {
    this.oEquipoService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (data: IPage<IEquipo>) => {
        this.equipos.set(data.content || []);
        this.loadingEquipos.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando equipos');
        this.loadingEquipos.set(false);
        this.snackBar.open('Error cargando equipos', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  onSubmit() {
    if (this.submitting() || this.ligaForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.ligaForm.controls).forEach(key => {
        this.ligaForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const formValue = this.ligaForm.getRawValue();
    
    const payload: Partial<ILiga> = {
      id: this.idLiga(),
      nombre: formValue.nombre.trim(),
      equipo: { id: formValue.id_equipo },
    };

    this.oLigaService.update(payload).subscribe({
      next: (id: number) => {
        this.submitting.set(false);
        this.snackBar.open('Liga actualizada correctamente', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/liga']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando la liga');
        this.submitting.set(false);
        this.snackBar.open('Error actualizando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel() {
    this.router.navigate(['/liga']);
  }

  private loadEquipo(): void {
    const idEquipo = this.ligaForm.get('id_equipo')?.value;
    if (idEquipo) {
      this.oEquipoService.get(idEquipo).subscribe({
        next: (equipo) => {
          this.selectedEquipo.set(equipo);
          this.displayIdEquipo.set(equipo.id ?? null);
        },
        error: (err: HttpErrorResponse) => {
          this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 4000 });
          console.error(err);
        },
      });
    } else {
      this.selectedEquipo.set(null);
      this.displayIdEquipo.set(null);
    }
  }

  private syncEquipo(idEquipo: number): void {
    this.displayIdEquipo.set(idEquipo);
    const equipoSeleccionado = this.equipos().find((t) => t.id === idEquipo);
    if (equipoSeleccionado) {
      this.selectedEquipo.set(equipoSeleccionado);
    } else {
      this.selectedEquipo.set(null);
    }
  }

  openEquipoFinderModal(): void {
      const dialogRef = this.dialog.open(EquipoPlistAdminUnrouted, {
        height: '800px',
        width: '1100px',
        maxWidth: '95vw',
        panelClass: 'equipo-dialog',
        data: {
          title: 'Aqui eliges el eqquipo',
          message: 'Plist finder para encontrar el equipo y asignarlo al articulo',
        },
      });
  
      dialogRef.afterClosed().subscribe((equipo: IEquipo | null) => {
        if (equipo) {
          this.ligaForm.patchValue({
            id_equipo: equipo.id,
          });
          // Sincronizar explícitamente después de seleccionar desde el modal
          this.syncEquipo(equipo.id!);
          this.snackBar.open(`Equipo seleccionado: ${equipo.nombre}`, 'Cerrar', {
            duration: 3000,
          });
        }
      });
    }
}
