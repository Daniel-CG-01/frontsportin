import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { CuotaService } from '../../../service/cuota';
import { ICuota } from '../../../model/cuota';


@Component({
  selector: 'app-usuario-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './cuota-view.html',
  styleUrl: './cuota-view.css',
})
export class CuotaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oCuotaService = inject(CuotaService);
  //private snackBar = inject(MatSnackBar);

  oCuota = signal<ICuota | null>(null);
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
    this.oCuotaService.get(id).subscribe({
      next: (data: ICuota) => {
        this.oCuota.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
