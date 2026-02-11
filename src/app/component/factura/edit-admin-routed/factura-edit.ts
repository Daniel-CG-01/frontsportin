import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators as v } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from '../../../service/factura-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { IFactura } from '../../../model/factura';
import { IUsuario } from '../../../model/usuario';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioPlist } from '../../usuario/usuario-plist/usuario-plist';
import { UsuarioService } from '../../../service/usuarioService';

@Component({
  selector: 'app-factura-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './factura-edit.html',
  styleUrl: './factura-edit.css',
})
export class FacturaEditAdminRouted {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private oFacturaService = inject(FacturaService);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  idFactura = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  usuarios = signal<IUsuario[]>([]);
  selectedUsuario = signal<IUsuario | null>(null);
  
  facturaForm = this.fb.group({
    id: [{ value: 0, disabled: true }],
    fecha: ['', [v.required]],
    usuario: [0, [v.required, v.min(1)]],
  });

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(idParam) || idParam <= 0) {
      this.error.set('ID de factura no válido');
      this.loading.set(false);
      return;
    }

    this.idFactura.set(idParam);
    this.loadUsuarios();
    this.loadFactura();
  }

  private loadFactura(): void {
    this.oFacturaService.get(this.idFactura()).subscribe({
      next: (factura: IFactura) => {
        this.facturaForm.patchValue({
          id: factura.id,
          fecha: factura.fecha,
          usuario: factura.usuario?.id,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Error cargando la factura');
        this.snackBar.open('Error cargando la factura', 'Cerrar', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
      },
    });
  }
  
  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const usuarioId = this.facturaForm.get('usuario')!.value!;
    const facturaData: Partial<IFactura> = {
      id: this.idFactura(),
      fecha: this.facturaForm.get('fecha')!.value!,
      usuario: { id: usuarioId } as IUsuario,
    };

    this.oFacturaService.update(facturaData).subscribe({
      next: () => {
        this.snackBar.open('Factura actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/factura']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error.set('Error actualizando la factura');
        this.snackBar.open('Error actualizando la factura', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }

  openUsuarioFinderModal(): void {
    const dialogRef = this.dialog.open(UsuarioPlist, {
      height: '800px',
      width: '1600px',
      maxWidth: '95vw',
      panelClass: 'usuario-dialog',
      data: {
        title: 'Aqui elegir usuario',
        message: 'Plist finder para encontrar el usuario y asignarlo al factura',
      },
    });

    dialogRef.afterClosed().subscribe((usuario: IUsuario | null) => {
      if (usuario) {
        this.selectedUsuario.set(usuario);
        this.facturaForm.patchValue({
          usuario: usuario.id,
        });
        this.snackBar.open(
          `Usuario seleccionado: ${usuario.nombre}`,
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
