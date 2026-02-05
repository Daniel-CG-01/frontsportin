import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../service/jugador-service';
import { IJugador } from '../../../model/jugador';
import { serverURL } from '../../../environment/environment';

@Component({
  selector: 'app-jugador-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './jugador-view.html',
  styleUrls: ['./jugador-view.css'],
})
export class JugadorViewRouted implements OnInit {

  private route = inject(ActivatedRoute);
  private jugadorService = inject(JugadorService);
  private router = inject(Router);

  jugador = signal<IJugador | null>(null);
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
    this.loading.set(true);
    this.error.set(null);

    this.jugadorService.getById(id).subscribe({
      next: (data: IJugador) => {
        this.jugador.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar el jugador:', err);
        this.error.set('No se pudo cargar la información del jugador');
        this.loading.set(false);
      }
    });
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return '';
    return `${serverURL}/jugador/imagen/${imagen}`;
  }

  goBack(): void {
    this.router.navigate(['/jugador']);
  }
}
