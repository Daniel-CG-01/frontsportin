import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TemporadaService } from '../../../service/temporada';
import { CategoriaService } from '../../../service/categoria';
import { ITemporada } from '../../../model/temporada';
import { ICategoria } from '../../../model/categoria';
import { IPage } from '../../../model/plist';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-temporada-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './temporada-view.html',
  styleUrl: './temporada-view.css',
})
export class TemporadaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oTemporadaService = inject(TemporadaService);
  private oCategoriaService = inject(CategoriaService);
  oTemporada = signal<ITemporada | null>(null);
  oCategoriasPage = signal<IPage<ICategoria> | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  load(id: number) {
    this.oTemporadaService.get(id).subscribe({
      next: (data: ITemporada) => {
        this.oTemporada.set(data);
        this.loadCategorias(id);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la temporada');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  loadCategorias(idTemporada: number) {
    this.oCategoriaService.getPage(0, 100, '', '', '', idTemporada).subscribe({
      next: (data: IPage<ICategoria>) => {
        this.oCategoriasPage.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando las categorías');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
