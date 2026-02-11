import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { JugadorService } from '../../../service/jugador-service';
import { IJugador } from '../../../model/jugador';
import { serverURL } from '../../../environment/environment';
import { JugadorDetailAdminUnrouted } from '../detail-admin-unrouted/jugador-detail';

@Component({
  selector: 'app-jugador-view',
  imports: [CommonModule, JugadorDetailAdminUnrouted],
  templateUrl: './jugador-view.html',
  styleUrls: ['./jugador-view.css'],
})
export class JugadorViewRouted implements OnInit {

  private route = inject(ActivatedRoute);
  //private snackBar = inject(MatSnackBar);

  oJugador = signal<IJugador | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_jugador = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_jugador.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_jugador())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return '';
    return `${serverURL}/jugador/imagen/${imagen}`;
  }

}
