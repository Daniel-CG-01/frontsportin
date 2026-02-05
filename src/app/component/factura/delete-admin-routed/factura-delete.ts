import { Component, inject, signal } from '@angular/core';
import { FacturaDetailAdminUnrouted } from '../detail-admin-unrouted/factura-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FacturaService } from '../../../service/factura-service';

@Component({
  selector: 'app-delete-admin-routed',
  imports: [FacturaDetailAdminUnrouted],
  templateUrl: './factura-delete.html',
  styleUrl: './factura-delete.css',
})
export class DeleteAdminRouted {
 private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oFacturaService = inject(FacturaService)

  id = signal<number>(0);
  deleting = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idValue = idParam ? Number(idParam) : NaN;
    if (!isNaN(idValue)) {
      this.id.set(idValue);
    }
  }

   delete(): void {
    if (this.id() <= 0) {
      this.error.set('ID de factura inválido');
      return;
    }
    this.deleting.set(true);
    this.error.set(null);
    this.oFacturaService.delete(this.id()).subscribe({
      next: () => {
        this.deleting.set(false);
        this.router.navigate(['/factura']);
      },
      error: (err) => {
        this.deleting.set(false);
        // err may be HttpErrorResponse
        this.error.set(err?.message ?? 'Error desconocido al eliminar');
      },
    });
  }
}
