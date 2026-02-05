import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CarritoService } from '../../../service/carrito';
import { ICarrito } from '../../../model/carrito';

@Component({
  selector: 'app-view-admin-routed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-admin-routed.html',
  styleUrl: './view-admin-routed.css',
})
export class CarritoViewAdminRouted {
    carrito = signal<ICarrito | null>(null);
    loading = signal<boolean>(false);
    error = signal<string>('');

    constructor(private carritoService: CarritoService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadCarrito(id);
        }
    }

    loadCarrito(id: number) {
        this.loading.set(true);
        this.error.set('');

        this.carritoService.getById(id).subscribe({
        next: (data: ICarrito) => {
            this.carrito.set(data);
            this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
            console.error(error);
            this.error.set('No se ha podido cargar el carrito.');
            this.loading.set(false);
        }
        });
    }   
}
