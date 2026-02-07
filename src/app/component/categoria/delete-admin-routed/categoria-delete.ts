import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaDetailAdminUnrouted } from '../detail-admin-unrouted/categoria-detail';
import { CategoriaService } from '../../../service/categoria';
import { ICategoria } from '../../../model/categoria';


@Component({
  selector: 'app-pago-view',
  imports: [CommonModule, CategoriaDetailAdminUnrouted],
  templateUrl: './categoria-delete.html',
  styleUrl: './categoria-delete.css',
})

export class CategoriaDeleteAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);  
  private oCategoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);

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

  doDelete() {
    this.oCategoriaService.delete(this.id_categoria()).subscribe({
      next: (data: any) => {
        this.snackBar.open('Categoria eliminada', 'Cerrar', { duration: 4000 });
        console.log('Categoria eliminada');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando la categoria');
        this.snackBar.open('Error eliminando la categoria', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
  
  doCancel() {    
    window.history.back();
  }




}
