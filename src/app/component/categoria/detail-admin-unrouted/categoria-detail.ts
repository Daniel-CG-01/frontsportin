import { Component, signal, OnInit, inject, Input, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatetimePipe } from '../../../pipe/datetime-pipe';
import { CategoriaService } from '../../../service/categoria';
import { ICategoria } from '../../../model/categoria';

@Component({
  selector: 'app-categoria-detail-unrouted',
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria-detail.html',
  styleUrl: './categoria-detail.css',
})

export class CategoriaDetailAdminUnrouted implements OnInit {

  @Input() id: Signal<number> = signal(0);
  
  private oCategoriaService = inject(CategoriaService);
  //private snackBar = inject(MatSnackBar);

  oCategoria = signal<ICategoria | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {  
    this.load(this.id());
  }

  load(id: number) {
    this.oCategoriaService.get(id).subscribe({
      next: (data: ICategoria) => {
        this.oCategoria.set(data);
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
