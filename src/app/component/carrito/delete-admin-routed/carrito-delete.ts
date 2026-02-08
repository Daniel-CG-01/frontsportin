import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { CarritoDetailAdminUnrouted } from "../detail-admin-unrouted/carrito-detail";
import { CarritoService } from '../../../service/carrito';
import { ICarrito } from '../../../model/carrito';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carrito-view',
  imports: [CommonModule, CarritoDetailAdminUnrouted],
  templateUrl: './carrito-delete.html',
  styleUrl: './carrito-delete.css',
})

export class CarritoDeleteAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);  
  private oCarritoService = inject(CarritoService);
  private snackBar = inject(MatSnackBar);

  oCarrito = signal<ICarrito | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_carrito = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_carrito.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_carrito())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }    
  }

  doDelete() {
    this.oCarritoService.delete(this.id_carrito()).subscribe({
      next: (data: any) => {
        this.snackBar.open('Carrito eliminado', 'Cerrar', { duration: 4000 });
        console.log('Carrito eliminado');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el carrito');
        this.snackBar.open('Error eliminando el carrito', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
  
  doCancel() {    
    window.history.back();
  }




}
