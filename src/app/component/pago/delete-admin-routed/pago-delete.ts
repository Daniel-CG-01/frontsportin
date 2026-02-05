import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { PagoService } from '../../../service/pago';
import { IPago } from '../../../model/pago';
import { PagoDetailAdminUnrouted } from "../detail-admin-unrouted/pago-detail";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-pago-view',
  imports: [CommonModule, PagoDetailAdminUnrouted],
  templateUrl: './pago-delete.html',
  styleUrl: './pago-delete.css',
})

export class PagoDeleteAdminRouted implements OnInit {

  private route = inject(ActivatedRoute);  
  private oPagoService = inject(PagoService);
  private snackBar = inject(MatSnackBar);

  oPago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_pago = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_pago.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_pago())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }    
  }

  doDelete() {
    this.oPagoService.delete(this.id_pago()).subscribe({
      next: (data: any) => {
        this.snackBar.open('Pago eliminado', 'Cerrar', { duration: 4000 });
        console.log('Pago eliminado');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el pago');
        this.snackBar.open('Error eliminando el pago', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
  
  doCancel() {    
    window.history.back();
  }




}
