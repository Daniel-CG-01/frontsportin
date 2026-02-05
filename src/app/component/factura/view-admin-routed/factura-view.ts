import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { FacturaService } from '../../../service/factura-service';
import { IFactura } from '../../../model/factura';


@Component({
  selector: 'app-factura-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './factura-view.html',
  styleUrl: './factura-view.css',
})
export class FacturaViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oFacturaService = inject(FacturaService);
  //private snackBar = inject(MatSnackBar);

  oFactura = signal<IFactura | null>(null);
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
    this.oFacturaService.get(id).subscribe({
      next: (data: IFactura) => {
        this.oFactura.set(data);
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
