import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { JugadorService } from '../../../service/jugador-service';
import { IJugador } from '../../../model/jugador';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JugadorDetailAdminUnrouted } from '../detail-admin-unrouted/jugador-detail';


@Component({
  selector: 'app-jugador-view',
  imports: [CommonModule, JugadorDetailAdminUnrouted],
  templateUrl: './jugador-delete.html',
  styleUrl: './jugador-delete.css',
})

export class JugadorDeleteAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);  
  private oJugadorService = inject(JugadorService);
  private snackBar = inject(MatSnackBar);

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
    
    this.oJugadorService.getById(this.id_jugador()).subscribe({
      next: (data) => {
        this.oJugador.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando el jugador');
        this.loading.set(false);
      }
    });
  }

  doDelete() {
    this.oJugadorService.delete(this.id_jugador()).subscribe({
      next: (data: any) => {
        this.snackBar.open('Jugador eliminado', 'Cerrar', { duration: 4000 });
        console.log('Jugador eliminado');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el jugador');
        this.snackBar.open('Error eliminando el jugador', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
  
  doCancel() {    
    window.history.back();
  }
}