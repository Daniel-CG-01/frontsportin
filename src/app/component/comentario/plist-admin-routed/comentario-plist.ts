import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { ComentarioService } from '../../../service/comentario';
import { IComentario } from '../../../model/comentario';
import { IPage } from '../../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch, serverURL } from '../../../environment/environment';

@Component({
  standalone: true,
  selector: 'app-comentario-plist',
  templateUrl: './comentario-plist.html',
  styleUrls: ['./comentario-plist.css'],
  imports: [
    CommonModule,
    Paginacion,
    BotoneraRpp,
    RouterLink,
    TrimPipe
  ]
})
export class ComentarioPlistAdminRouted {

  oPage = signal<IPage<IComentario> | null>(null);
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
  idUsuario = signal<number>(0);
  idNoticia = signal<number>(0);

  private routeSub?: Subscription;
  // Variables de búsqueda
  contenido = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private oComentarioService: ComentarioService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Suscribirse a los cambios de parámetros de ruta (reactivo)

    this.routeSub = this.route.params.subscribe((params) => {
      this.idUsuario.set(params['usuario'] ? Number(params['usuario']) : 0);
      this.idNoticia.set(params['noticia'] ? Number(params['noticia']) : 0);

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
        this.contenido.set(searchTerm);
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
      posicion: this.contenido(),
      usuario: this.idUsuario(),
      equipo: this.idNoticia()
    });
    
    this.oComentarioService.getPage(
      this.numPage(), 
      this.numRpp(), 
      this.orderField(), 
      this.orderDirection(),
      this.contenido(),
      this.idUsuario(),
      this.idNoticia()
    ).subscribe({
      next: (data: IPage<IComentario>) => {
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

  onSearch(value: string) {
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
