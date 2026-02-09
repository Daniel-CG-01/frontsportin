import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarritoService } from '../../../service/carrito';
import { ArticuloService } from '../../../service/articulo';
import { UsuarioService } from '../../../service/usuarioService';
import { ICarrito } from '../../../model/carrito';
import { IArticulo } from '../../../model/articulo';
import { IUsuario } from '../../../model/usuario';

@Component({
  selector: 'app-carrito-edit-admin-routed',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './carrito-edit.html',
  styleUrl: './carrito-edit.css',
})
export class CarritoEditAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private oCarritoService = inject(CarritoService);
  private oArticuloService = inject(ArticuloService);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);

  carritoForm!: FormGroup;
  id_carrito = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);
  submitting = signal(false);
  articulos = signal<IArticulo[]>([]);
  usuarios = signal<IUsuario[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadArticulos();
    this.loadUsuarios();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || idParam === '0') {
      this.error.set('ID de carrito no válido');
      this.loading.set(false);
      return;
    }

    this.id_carrito.set(Number(idParam));

    if (isNaN(this.id_carrito())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }

    this.loadCarrito();
  }

  private initForm(): void {
    this.carritoForm = this.fb.group({
      id: [{ value: 0, disabled: true }],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      id_articulo: [null, Validators.required],
      id_usuario: [null, Validators.required],
    });
  }

  private loadCarrito(): void {
    this.oCarritoService.get(this.id_carrito()).subscribe({
      next: (carrito: ICarrito) => {
        this.carritoForm.patchValue({
          id: carrito.id,
          cantidad: carrito.cantidad,
          id_articulo: carrito.articulo?.id,
          id_usuario: carrito.usuario?.id,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el carrito');
        this.snackBar.open('Error cargando el carrito', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private loadArticulos(): void {
    this.oArticuloService.getPage(0, 1000, 'descripcion', 'asc').subscribe({
      next: (page) => {
        this.articulos.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando artículos', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  private loadUsuarios(): void {
    this.oUsuarioService.getPage(0, 1000, 'nombre', 'asc').subscribe({
      next: (page) => {
        this.usuarios.set(page.content);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Error cargando usuarios', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  get cantidad() {
    return this.carritoForm.get('cantidad');
  }

  get id_articulo() {
    return this.carritoForm.get('id_articulo');
  }

  get id_usuario() {
    return this.carritoForm.get('id_usuario');
  }

  onSubmit(): void {
    if (this.carritoForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos correctamente', 'Cerrar', {
        duration: 4000,
      });
      return;
    }

    this.submitting.set(true);

    const carritoData: any = {
      id: this.id_carrito(),
      cantidad: this.carritoForm.value.cantidad,
      articulo: { id: this.carritoForm.value.id_articulo },
      usuario: { id: this.carritoForm.value.id_usuario },
    };

    this.oCarritoService.update(carritoData).subscribe({
      next: (id: number) => {
        this.snackBar.open('Carrito actualizado exitosamente', 'Cerrar', { duration: 4000 });
        this.submitting.set(false);
        this.router.navigate(['/carrito']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error actualizando el carrito');
        this.snackBar.open('Error actualizando el carrito', 'Cerrar', { duration: 4000 });
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}
