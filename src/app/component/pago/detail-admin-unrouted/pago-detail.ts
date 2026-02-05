import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { PagoService } from '../../../service/pago';
import { IPago } from '../../../model/pago';

@Component({
  selector: 'app-pago-detail-unrouted',
  imports: [CommonModule, RouterLink],
  templateUrl: './pago-detail.html',
  styleUrl: './pago-detail.css',
})

export class PagoDetailAdminUnrouted implements OnInit {

  @Input() id: Signal<number> = signal(0);
  
  private oPagoService = inject(PagoService);
  //private snackBar = inject(MatSnackBar);

  oPago = signal<IPago | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {  
    this.load(this.id());
  }

  load(id: number) {
    this.oPagoService.get(id).subscribe({
      next: (data: IPago) => {
        this.oPago.set(data);
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
