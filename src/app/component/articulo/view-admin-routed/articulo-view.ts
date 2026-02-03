import { Component, signal, computed, effect } from '@angular/core';
import { IArticulo } from '../../../model/articulo';
import { ArticuloService } from '../../../service/articulo';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-articulo-view',
  imports: [RouterLink],
  templateUrl: './articulo-view.html',
  styleUrl: './articulo-view.css',
})
export class ArticuloViewAdminRouted {


  constructor(
    private oArticuloService: ArticuloService,
    private route: ActivatedRoute,
  ) {} 
  id: number = 0; 
  loading = signal(true);
  oArticulo= signal<IArticulo | null>(null);
  error= signal<string| null>(null);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
      this.id = +idParam;
      this.load();
    } else {
      this.error.set("Error: No se ha proporcionado un ID válido.");
      this.loading.set(false);
    }
  }

  load() {
    this.oArticuloService.get(this.id).subscribe({
      next: (data: IArticulo) => {
        this.oArticulo.set(data);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(`Error al recuperar el artículo: ${error.message}`);
        this.loading.set(false);
        console.error(error);
      },
    });

  }
}
