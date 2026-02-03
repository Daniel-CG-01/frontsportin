import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { UsuarioService } from '../../../service/usuarioService';
import { IUsuario } from '../../../model/usuario';


@Component({
  selector: 'app-usuario-view',
  imports: [CommonModule, RouterLink, DatetimePipe],
  templateUrl: './usuario-view.html',
  styleUrl: './usuario-view.css',
})
export class UsuarioViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oUsuarioService = inject(UsuarioService);
  //private snackBar = inject(MatSnackBar);

  oUsuario = signal<IUsuario | null>(null);
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
    this.oUsuarioService.get(id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error cargando el usuario');
        this.loading.set(false);
        //this.snackBar.open('Error cargando el usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
