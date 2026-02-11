import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILiga } from '../../../model/liga';
import { LigaService } from '../../../service/liga';
import { LigaDetailAdminUnrouted } from '../detail-admin-unrouted/liga-detail';

@Component({
  selector: 'app-liga-delete',
  imports: [CommonModule, LigaDetailAdminUnrouted],
  templateUrl: './liga-delete.html',
  styleUrl: './liga-delete.css',
})
export class LigaDeleteAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oLigaService = inject(LigaService);
  private snackBar = inject(MatSnackBar);

  oLiga = signal<ILiga | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  id_liga = signal<number>(0);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id_liga.set(idParam ? Number(idParam) : NaN);
    if (isNaN(this.id_liga())) {
      this.error.set('ID no valido');
      this.loading.set(false);
      return;
    }
    this.loading.set(false);
  }

  doDelete(): void {
    this.oLigaService.delete(this.id_liga()).subscribe({
      next: () => {
        this.snackBar.open('Liga eliminada', 'Cerrar', { duration: 4000 });
        console.log('Liga eliminada');
        window.history.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error eliminando la liga');
        this.snackBar.open('Error eliminando la liga', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  doCancel(): void {
    window.history.back();
  }
}
