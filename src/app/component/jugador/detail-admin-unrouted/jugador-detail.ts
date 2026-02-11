import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../service/jugador-service';
import { IJugador } from '../../../model/jugador';
import { serverURL } from '../../../environment/environment';

@Component({
  selector: 'app-jugador-detail-unrouted',
  imports: [CommonModule, RouterLink],
  templateUrl: './jugador-detail.html',
  styleUrl: './jugador-detail.css',
})
export class JugadorDetailAdminUnrouted implements OnInit {

  @Input() id: Signal<number> = signal(0);

  private jugadorService = inject(JugadorService);
  //private snackBar = inject(MatSnackBar);

  jugador = signal<IJugador | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
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

}
