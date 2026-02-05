import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PuntuacionService } from '../../../service/puntuacion';
import { IPuntuacion } from '../../../model/puntuacion';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  selector: 'app-view-routed',
  standalone: true,
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './puntuacion-view.html',
  styleUrls: ['./puntuacion-view.css'],
})
export class PuntuacionViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oPuntuacionService = inject(PuntuacionService);

oPuntuacion = signal<IPuntuacion | null>(null);
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
  this.loading.set(true);
  this.load(id);
  }

  load(id: number) {
    this.oPuntuacionService.get(id).subscribe({
      next: (data: IPuntuacion) => {
        this.oPuntuacion.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al cargar la puntuación');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

}
