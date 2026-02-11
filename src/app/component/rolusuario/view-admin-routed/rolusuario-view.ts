import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RolusuarioDetailAdminUnrouted } from '../detail-admin-unrouted/rolusuario-detail';

@Component({
  selector: 'app-rolusuario-view',
  imports: [CommonModule, RolusuarioDetailAdminUnrouted],
  templateUrl: './rolusuario-view.html',
  styleUrl: './rolusuario-view.css',
})
export class RolusuarioViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);

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
}
