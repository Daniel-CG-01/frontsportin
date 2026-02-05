import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Input, Signal, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IFactura } from '../../../model/factura';
import { FacturaService } from '../../../service/factura-service';
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-factura-detail-unrouted',
  imports: [RouterModule, DatetimePipe],
  templateUrl: './factura-detail.html',
  styleUrl: './factura-detail.css',
})
export class FacturaDetailAdminUnrouted {

  @Input() id: Signal<number> = signal(0);

  private oFacturaService = inject(FacturaService);
  //private snackBar = inject(MatSnackBar);

  oFactura = signal<IFactura | null>(null);
  loading = signal(true);
    error = signal<string | null>(null);
  
    ngOnInit(): void {  
      this.load(this.id());
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
