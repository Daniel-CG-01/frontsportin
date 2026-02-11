import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Signal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ILiga } from '../../../model/liga';
import { LigaService } from '../../../service/liga';

@Component({
  selector: 'app-liga-detail-unrouted',
  imports: [CommonModule, RouterLink],
  templateUrl: './liga-detail.html',
  styleUrl: './liga-detail.css',
})
export class LigaDetailAdminUnrouted implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oLigaService = inject(LigaService);

  oLiga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  equipoId(): number | null {
    const liga = this.oLiga();
    if (!liga) return null;
    const equipo: any = liga.equipo;
    if (!equipo) return null;
    if (typeof equipo === 'number') return equipo;
    if (equipo.id !== undefined && equipo.id !== null) return Number(equipo.id);
    return null;
  }

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number): void {
    this.oLigaService.get(id).subscribe({
      next: (data: ILiga) => {
        this.oLiga.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando la liga');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
