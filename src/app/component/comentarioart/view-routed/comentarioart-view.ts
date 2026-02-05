import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ComentarioartService } from '../../../service/comentarioart';
import { IComentarioart } from '../../../model/comentarioart';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-comentarioart-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './comentarioart-view.html',
  styleUrl: './comentarioart-view.css',
})
export class ComentarioartViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oComentarioartService = inject(ComentarioartService);

  oComentarioart = signal<IComentarioart | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.error.set('ID no valido');
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  private load(id: number) {
    this.oComentarioartService.getById(id).subscribe({
      next: (data: IComentarioart) => {
        this.oComentarioart.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el comentario');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
