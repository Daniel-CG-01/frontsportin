import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { LigaService } from '../../../service/liga';
import { ILiga } from '../../../model/liga';

@Component({
  selector: 'app-liga-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './liga-view.html',
  styleUrl: './liga-view.css',
})
export class LigaViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oLigaService = inject(LigaService);

  oLiga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Devuelve el id del equipo de forma segura aunque la respuesta tenga solo id o un objeto parcial
  equipoId(): number | null {
    const liga = this.oLiga();
    if (!liga) return null;
    const equipo: any = liga.equipo;
    if (!equipo) return null;
    // si equipo es un número
    if (typeof equipo === 'number') return equipo;
    // si equipo es un objeto con id
    if (equipo.id !== undefined && equipo.id !== null) return Number(equipo.id);
    return null;
  }

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
