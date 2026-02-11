import { Component, signal, computed } from '@angular/core';
import { IPage } from '../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../shared/paginacion/paginacion';
import { BotoneraRpp } from '../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch } from '../../environment/environment';
import { ComentarioartService } from '../../service/comentarioart';
import { IComentarioart } from '../../model/comentarioart';

@Component({
  selector: 'app-comentarioart-plist',
  standalone: true,
  imports: [Paginacion, BotoneraRpp, RouterLink],
  templateUrl: './comentarioart-plist.html',
  styleUrl: './comentarioart-plist.css',
})
export class ComentarioartPlistAdminRouted {
  oPage = signal<IPage<IComentarioart> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);
  rellenaCantidad = signal<number>(10);
  rellenando = signal<boolean>(false);
  rellenaOk = signal<number | null>(null);
  rellenaError = signal<string | null>(null);
  publishingId = signal<number | null>(null);
  publishingAction = signal<'publicar' | 'despublicar' | null>(null);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  articulo = signal<number>(0);
  usuario = signal<number>(0);

  // Variables de búsqueda
  contenido = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(private oComentarioartService: ComentarioartService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idArticulo = params.get('id_articulo');
      const idUsuario = params.get('id_usuario');

      if (idArticulo) {
        this.articulo.set(+idArticulo);
        this.usuario.set(0);
      } else if (idUsuario) {
        this.articulo.set(0);
        this.usuario.set(+idUsuario);
      } else {
        this.articulo.set(0);
        this.usuario.set(0);
      }

      this.numPage.set(0);
      this.getPage();
    })

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

    this.getPage();
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage() {
    this.oComentarioartService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.contenido(),
        this.articulo(),
        this.usuario(),
      )
      .subscribe({
        next: (data: IPage<IComentarioart>) => {
          this.oPage.set(data);
          if (this.numPage() > 0 && this.numPage() >= data.totalPages) {
            this.numPage.set(data.totalPages - 1);
            this.getPage();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
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

  onCantidadChange(value: string) {
    this.rellenaCantidad.set(+value);
  }

  onSearchContenido(value: string) {
    // Emitir el valor al Subject para que sea procesado con debounce
    this.searchSubject.next(value);
  }

  getArticuloId(comentario: IComentarioart | null | undefined): number | null {
    if (!comentario) {
      return null;
    }
    return (
      comentario.idArticulo ??
      comentario.id_articulo ??
      comentario.articulo?.id ??
      null
    );
  }

  getUsuarioId(comentario: IComentarioart | null | undefined): number | null {
    if (!comentario) {
      return null;
    }
    return (
      comentario.idUsuario ??
      comentario.id_usuario ??
      comentario.usuario?.id ??
      null
    );
  }
}
