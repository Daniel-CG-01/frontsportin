import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../service/categoria';
import { ICategoria } from '../../../model/categoria';
import { CategoriaDetailAdminUnrouted } from '../detail-admin-unrouted/categoria-detail';


@Component({
  selector: 'app-categoria-view',
  imports: [CommonModule, RouterLink, CategoriaDetailAdminUnrouted],
  templateUrl: './categoria-view.html',
  styleUrl: './categoria-view.css',
})
export class CategoriaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oCategoriaService = inject(CategoriaService);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

   id_categoria = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_categoria.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_categoria())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }    
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
