import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EquipoService } from '../../../service/equipo';
import { IEquipo } from '../../../model/equipo';
import { DatetimePipe } from '../../../pipe/datetime-pipe';


@Component({
  selector: 'app-equipo-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './equipo-view.html',
  styleUrl: './equipo-view.css',
})
export class EquipoViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oEquipoService = inject(EquipoService);
  //private snackBar = inject(MatSnackBar);

  oEquipo = signal<IEquipo | null>(null);
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
    this.oEquipoService.get(id).subscribe({
      next: (data: IEquipo) => {
        this.oEquipo.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el equipo');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el equipo', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
