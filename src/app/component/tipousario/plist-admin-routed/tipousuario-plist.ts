import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ITipousuario } from '../../../model/tipousuario';
import { TipousuarioService } from '../../../service/tipousuario';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tipousuario-plist',
  imports: [CommonModule, RouterLink],
  templateUrl: './tipousuario-plist.html',
  styleUrl: './tipousuario-plist.css',
})
export class TipousuarioPlistAdminRouted {

  tipousuarios = signal<ITipousuario[]>([]);
  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  constructor(private tipousuarioService: TipousuarioService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.tipousuarioService.getAll().subscribe({
      next: (data: ITipousuario[]) => {
        this.tipousuarios.set(data);
        this.applyOrder();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  onOrder(column: string) {
    if (this.orderField() === column) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(column);
      this.orderDirection.set('asc');
    }
    this.applyOrder(); // Re-ordenamos el array localmente
  }

  private applyOrder() {
    if (this.tipousuarios()) {
      this.tipousuarios().sort((a, b) => {
        let valueA = a[this.orderField() as keyof ITipousuario];
        let valueB = b[this.orderField() as keyof ITipousuario];

        if (typeof valueA === 'string') {
          // Orden alfabético ignorando mayúsculas/minúsculas
          return this.orderDirection() === 'asc' 
            ? valueA.localeCompare(valueB as string)
            : (valueB as string).localeCompare(valueA);
        } else {
          // Orden numérico (para el ID)
          return this.orderDirection() === 'asc' 
            ? (valueA as number) - (valueB as number)
            : (valueB as number) - (valueA as number);
        }
      });
    }
  }

}
