import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../service/categoria';
import { ICategoria } from '../../../model/categoria';


@Component({
  selector: 'app-categoria-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria-view.html',
  styleUrl: './categoria-view.css',
})
export class CategoriaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oCategoriaService = inject(CategoriaService);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;
      
      if (isNaN(id)) {
        this.error.set('ID no válido');
        this.loading.set(false);
        return;
      }
      
      // Resetear el estado antes de cargar
      this.loading.set(true);
      this.error.set(null);
      this.load(id);
    });
  }

  load(id: number) {
    this.oCategoriaService.get(id).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la categoría');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
