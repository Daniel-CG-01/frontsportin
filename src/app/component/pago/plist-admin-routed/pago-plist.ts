import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { PagoService } from '../../../service/pago';
import { IPago } from '../../../model/pago';
import { IPage } from '../../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { DatetimePipe } from '../../../pipe/datetime-pipe';

@Component({
  standalone: true,
  selector: 'app-pago-plist',
  templateUrl: './pago-plist.html',
  styleUrls: ['./pago-plist.css'],
  imports: [
    CommonModule,
    Paginacion,
    BotoneraRpp,
    RouterLink,
    TrimPipe,
    DatetimePipe
  ]
})
export class PagoPlistComponent {

  oPage = signal<IPage<IPago> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  cuota = signal<number>(0);
  jugador = signal<number>(0);

  constructor(
    private pagoService: PagoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de parámetros de ruta (reactivo)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      // Leer la URL actual DENTRO de la suscripción para que sea reactiva
      const currentUrl = this.route.snapshot.url.map(segment => segment.path).join('/');
      
      if (id) {
        if (currentUrl.includes('cuota')) {
          this.cuota.set(+id);
          this.jugador.set(0);
        } else if (currentUrl.includes('jugador')) {
          this.jugador.set(+id);
          this.cuota.set(0);
        }
      } else {
        // Limpiar filtros si no hay parámetro
        this.cuota.set(0);
        this.jugador.set(0);
      }
      
      this.numPage.set(0);
      this.getPage();
    });

    // Suscribirse a queryParams para mensajes
    this.route.queryParams.subscribe((params) => {
      const msg = params['msg'];
      if (msg) {
        this.showMessage(msg);
      }
    });
  }

  private showMessage(msg: string, duration: number = 4000) {
    this.message.set(msg);
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.message.set(null);
      this.messageTimeout = null;
    }, duration);
  }

  getPage() {
    console.log('getPage() - Filtros:', {
      cuota: this.cuota(),
      jugador: this.jugador()
    });
    
    this.pagoService.getPage(
      this.numPage(), 
      this.numRpp(), 
      this.orderField(), 
      this.orderDirection(),
      this.cuota(),
      this.jugador()
    ).subscribe({
      next: (data: IPage<IPago>) => {
        console.log('Pagos recibidos:', data.content.length, 'Total:', data.totalElements);
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  onOrder(order: string) {
    if (this.orderField() === order) {
      this.orderDirection.set(this.orderDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.orderField.set(order);
      this.orderDirection.set('asc');
    }
    this.numPage.set(0);
    this.getPage();
  }

  goToPage(numPage: number) {
    this.numPage.set(numPage);
    this.getPage();
  }

  onRppChange(n: number) {
    this.numRpp.set(n);
    this.numPage.set(0);
    this.getPage();
  }
}
