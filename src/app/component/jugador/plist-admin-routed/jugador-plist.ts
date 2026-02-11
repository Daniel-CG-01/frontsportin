import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { JugadorService } from '../../../service/jugador-service';
import { IJugador } from '../../../model/jugador';
import { IPage } from '../../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch, serverURL } from '../../../environment/environment';

@Component({
  standalone: true,
  selector: 'app-jugador-plist',
  templateUrl: './jugador-plist.html',
  styleUrls: ['./jugador-plist.css'],
  imports: [
    CommonModule,
    Paginacion,
    BotoneraRpp,
    RouterLink,
    TrimPipe
  ]
})
export class JugadorPlist {

  oPage = signal<IPage<IJugador> | null>(null);
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
  usuario = signal<number>(0);
  equipo = signal<number>(0);

  // Variables de búsqueda
  posicion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private jugadorService: JugadorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de parámetros de ruta (reactivo)
    this.route.paramMap.subscribe(params => {
      const idUsuario = params.get('id_usuario');
      const idEquipo = params.get('id_equipo');
      
      if (idUsuario) {
        this.usuario.set(+idUsuario);
        this.equipo.set(0);
        this.posicion.set(''); // Limpiar búsqueda por posición
      } else if (idEquipo) {
        this.equipo.set(+idEquipo);
        this.usuario.set(0);
        this.posicion.set(''); // Limpiar búsqueda por posición
      } else {
        // Limpiar filtros si no hay parámetro
        this.usuario.set(0);
        this.equipo.set(0);
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

    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch), // Espera 800ms después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo emite si el valor cambió
      )
      .subscribe((searchTerm: string) => {
        this.posicion.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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
      posicion: this.posicion(),
      usuario: this.usuario(),
      equipo: this.equipo()
    });
    
    this.jugadorService.getPage(
      this.numPage(), 
      this.numRpp(), 
      this.orderField(), 
      this.orderDirection(),
      this.posicion(),
      this.usuario(),
      this.equipo()
    ).subscribe({
      next: (data: IPage<IJugador>) => {
        console.log('Jugadores recibidos:', data.content.length, 'Total:', data.totalElements);
        this.oPage.set(data);
        if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
          this.numPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar jugadores:', error);
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

  onSearchPosicion(value: string) {
    // Emitir el valor al Subject para que sea procesado con debounce
    this.searchSubject.next(value);
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) {
      return '';
    }
    // Si la imagen ya tiene http:// o https://, devolverla tal cual
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      return imagen;
    }
    // Si no, construir la URL completa con el serverURL
    return `${serverURL}/${imagen}`;
  }
}
