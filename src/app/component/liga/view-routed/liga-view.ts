import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LigaDetailAdminUnrouted } from '../detail-admin-unrouted/liga-detail';

@Component({
  selector: 'app-liga-view',
  imports: [CommonModule, LigaDetailAdminUnrouted],
  templateUrl: './liga-view.html',
  styleUrl: './liga-view.css',
})
export class LigaViewRouted implements OnInit {
  private route = inject(ActivatedRoute);

  id_liga = signal<number>(0);
  loading = signal(true);
  error = signal<string | null>(null);

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
}
