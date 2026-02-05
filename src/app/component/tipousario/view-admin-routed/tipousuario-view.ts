import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TipousuarioService } from '../../../service/tipousuario';
import { ITipousuario } from '../../../model/tipousuario';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-view-routed',
  imports: [RouterLink],
  templateUrl: './tipousuario-view.html',
  styleUrl: './tipousuario-view.css',
})
export class TipousuarioViewAdminRouted {
  // inyecciones
  private route = inject(ActivatedRoute);
  private tipousuarioService = inject(TipousuarioService);

  // variables
  oTipousuario = signal<ITipousuario | null>(null);
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
    this.tipousuarioService.get(id).subscribe({
      next: (data: ITipousuario) => {
        this.oTipousuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el tipousuario');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
