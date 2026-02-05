import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { TipoarticuloService } from '../../../service/tipoarticulo';
import { ITipoarticulo } from '../../../model/tipoarticulo';


@Component({
  selector: 'app-tipoarticulo-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './tipoarticulo-view.html',
  styleUrl: './tipoarticulo-view.css',
})
export class TipoarticuloViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oTipoarticuloService = inject(TipoarticuloService);
  //private snackBar = inject(MatSnackBar);

  oTipoarticulo = signal<ITipoarticulo | null>(null);
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
    this.oTipoarticuloService.get(id).subscribe({
      next: (data: ITipoarticulo) => {
        this.oTipoarticulo.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el tipo de artículo');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el tipo de artículo', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
