import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IFactura } from '../../../model/factura';
import { FacturaDetailAdminUnrouted } from '../detail-admin-unrouted/factura-detail';


@Component({
  selector: 'app-factura-view',
  imports: [CommonModule, FacturaDetailAdminUnrouted],
  templateUrl: './factura-view.html',
  styleUrl: './factura-view.css',
})
export class FacturaViewAdminRouted implements OnInit {
  
  private route = inject(ActivatedRoute);
  //private snackBar = inject(MatSnackBar);

  oFactura = signal<IFactura | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_factura = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_factura.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_factura())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }    
  }
}
