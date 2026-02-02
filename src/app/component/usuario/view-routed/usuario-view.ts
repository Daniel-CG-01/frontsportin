import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../..//usuario';
import { DatetimePipe } from '../../pipe/datetime-pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-view',
  imports: [CommonModule, RouterLink, DatetimePipe, MatSnackBarModule],
  templateUrl: './usuario-view.html',
  styleUrl: './usuario-view.css',
})
export class UsuarioViewRouted implements OnInit {
  private route = inject(ActivatedRoute);
  private oUsuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);

  oUsuario: IUsuario | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(id);
  }

  load(id: number) {
    this.oUsuarioService.get(id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando el usuario';
        this.loading = false;
        this.snackBar.open('Error cargando el usuario', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }
}
