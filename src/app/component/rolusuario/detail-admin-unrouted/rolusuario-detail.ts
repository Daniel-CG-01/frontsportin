import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RolusuarioService } from '../../../service/rolusuario';
import { IRolusuario } from '../../../model/rolusuario';

@Component({
  selector: 'app-rolusuario-detail-unrouted',
  imports: [CommonModule, RouterLink],
  templateUrl: './rolusuario-detail.html',
  styleUrl: './rolusuario-detail.css',
})
export class RolusuarioDetailAdminUnrouted implements OnInit {
  @Input() id: Signal<number> = signal(0);

  private oRolusuarioService = inject(RolusuarioService);

  oRolusuario = signal<IRolusuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load(this.id());
  }

  load(id: number) {
    this.oRolusuarioService.get(id).subscribe({
      next: (data: IRolusuario) => {
        this.oRolusuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el rol de usuario');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
