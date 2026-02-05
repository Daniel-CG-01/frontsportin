import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PartidoService } from '../../../service/partido';
import { IPartido } from '../../../model/partido';


@Component({
  selector: 'app-partido-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './partido-view.html',
  styleUrl: './partido-view.css',
})
export class PartidoViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oPartidoService = inject(PartidoService);

  oPartido = signal<IPartido | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.error.set('ID no válido');
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  load(id: number) {
    this.oPartidoService.get(id).subscribe({
      next: (data: IPartido) => {
        this.oPartido.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el partido');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
