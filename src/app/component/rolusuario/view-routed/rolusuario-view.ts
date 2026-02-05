import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IRolusuario } from '../../../model/rolusuario';
import { RolusuarioService } from '../../../service/rolusuario';
import { ActivatedRoute, RouterLink } from '@angular/router';



@Component({
  selector: 'app-rolusuario-view',
  imports: [CommonModule, RouterLink],
  templateUrl: './rolusuario-view.html',
  styleUrl: './rolusuario-view.css',
})
export class RolusuarioViewAdminRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oRolusuarioService = inject(RolusuarioService);
  //private snackBar = inject(MatSnackBar);

  oRolusuario = signal<IRolusuario | null>(null);
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
    this.oRolusuarioService.get(id).subscribe({
      next: (data: IRolusuario) => {
        this.oRolusuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el rol de usuario');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el rol de usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
