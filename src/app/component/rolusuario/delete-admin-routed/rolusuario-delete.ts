import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RolusuarioService } from '../../../service/rolusuario';
import { RolusuarioDetailAdminUnrouted } from '../detail-admin-unrouted/rolusuario-detail';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rolusuario-delete',
  imports: [CommonModule, RolusuarioDetailAdminUnrouted],
  templateUrl: './rolusuario-delete.html',
  styleUrl: './rolusuario-delete.css',
})
export class RolusuarioDeleteAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oRolusuarioService = inject(RolusuarioService);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  error = signal<string | null>(null);
  id_rolusuario = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_rolusuario.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_rolusuario())) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.loading.set(false);
  }

  doDelete() {
    this.oRolusuarioService.delete(this.id_rolusuario()).subscribe({
      next: () => {
        this.snackBar.open('Rol de usuario eliminado', 'Cerrar', { duration: 4000 });
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando el rol de usuario');
        this.snackBar.open('Error eliminando el rol de usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel() {
    window.history.back();
  }
}
