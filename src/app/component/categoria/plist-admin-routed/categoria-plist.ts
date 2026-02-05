import { Component, signal, computed, effect } from '@angular/core';
import { ICategoria } from '../../../model/categoria';
import { IPage } from '../../../model/plist';
import { CategoriaService } from '../../../service/categoria';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { debounceTimeSearch } from '../../../environment/environment';

@Component({
  selector: 'app-categoria-plist',
  imports: [Paginacion, BotoneraRpp, RouterLink],
  templateUrl: './categoria-plist.html',
  styleUrl: './categoria-plist.css',
})
export class CategoriaPlistAdminRouted {
  oPage = signal<IPage<ICategoria> | null>(null);
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
  
  // Computed que devuelve el total correcto según si hay búsqueda o filtro
  totalRecords = computed(() => {
    const page = this.oPage();
    if (!page) return 0;
    
    // Si hay búsqueda o filtro activo, mostrar el número de resultados filtrados
    if (this.nombre().length > 0 || this.temporada() > 0) {
      return page.content.length;
    }
    
    // Si no hay búsqueda ni filtro, mostrar el total de la base de datos
    return page.totalElements ?? 0;
  });
  
  private messageTimeout: any = null;

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  temporada = signal<number>(0);

  // Variables de búsqueda
  nombre = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private oCategoriaService: CategoriaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Leer el parámetro inicial
    const id = this.route.snapshot.paramMap.get('id_temporada');
    if (id) {
      this.temporada.set(+id);
    }

    // Suscribirse a cambios en los parámetros de ruta
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const temporadaId = params.get('id_temporada');
      console.log('Cambio en ruta, temporada:', temporadaId);
      
      if (temporadaId) {
        this.temporada.set(+temporadaId);
      } else {
        this.temporada.set(0);
      }
      
      // Resetear búsqueda cuando cambias de filtro de temporada
      this.nombre.set('');
      this.numPage.set(0);
      this.getPage();
    });

    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm: string) => {
        console.debug('categoria: debounced search term ->', searchTerm);
        this.nombre.set(searchTerm);
        this.numPage.set(0);
        this.getPage();
      });
  }

  ngOnDestroy() {
    // Limpiar las suscripciones para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  getPage() {
    console.debug('categoria: getPage params', {
      page: this.numPage(),
      rpp: this.numRpp(),
      order: this.orderField(),
      direction: this.orderDirection(),
      nombre: this.nombre(),
      temporada: this.temporada(),
    });

    this.oCategoriaService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.nombre(),
        this.temporada(),
      )
      .subscribe({
        next: (data: IPage<ICategoria>) => {
          let filtered = data.content;
          
          // Filtrar por temporada si está activo
          if (this.temporada() > 0) {
            filtered = filtered.filter((cat) => cat.temporada.id === this.temporada());
          }
          
          // Filtrar por nombre si está activo
          if (this.nombre().length > 0) {
            filtered = filtered.filter((cat) =>
              cat.nombre.toLowerCase().includes(this.nombre().toLowerCase()),
            );
          }
          
          // Actualizar la página con el contenido filtrado
          this.oPage.set({ 
            ...data, 
            content: filtered
          });
          
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

  onSearchName(value: string) {
    this.searchSubject.next(value);
  }

  clearSearchFilter() {
    this.nombre.set('');
    this.numPage.set(0);
    this.getPage();
  }
}