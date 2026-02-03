import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IPage } from '../../../model/plist';
import { ICarrito } from '../../../model/carrito';
import { CarritoService } from '../../../service/carrito';

import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { debounceTimeSearch } from '../../../environment/environment';

@Component({
  selector: 'app-carrito-plist',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginacion, BotoneraRpp],
  templateUrl: './carrito-plist.html',
  styleUrl: './carrito-plist.css',
})
export class CarritoPlistAdminRouted {
  oPage = signal<IPage<ICarrito> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);

  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  idArticulo = signal<number>(0);
  idUsuario = signal<number>(0);

  filtro = signal<string>('');

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  totalElementsCount = computed(() => this.oPage()?.totalElements ?? 0);

  private routeSub?: Subscription;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.idArticulo.set(params['articulo'] ? Number(params['articulo']) : 0);
      this.idUsuario.set(params['usuario'] ? Number(params['usuario']) : 0);
      this.numPage.set(0);
      this.getPage();
    });

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch),
        distinctUntilChanged()
      )
      .subscribe((term: string) => {
        this.filtro.set(term);
        this.numPage.set(0);
        this.getPage();
      });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.searchSubscription?.unsubscribe();
  }

  getPage() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.carritoService
      .getPage(
        0, // siempre cargamos desde la primera página
        1000, // lote grande para filtrar en cliente
        this.orderField(),
        this.orderDirection(),
        this.filtro().trim(),
        this.idArticulo(),
        this.idUsuario()
      )
      .subscribe({
        next: (data: IPage<ICarrito>) => {
          const filtered = data.content.filter((c) => {
            const byArticulo = this.idArticulo() === 0 || c.articulo?.id === this.idArticulo();
            const byUsuario = this.idUsuario() === 0 || c.usuario?.id === this.idUsuario();
            const bySearch =
              this.filtro().trim().length === 0 ||
              c.articulo?.descripcion?.toLowerCase().includes(this.filtro().trim().toLowerCase()) ||
              `${c.usuario?.nombre} ${c.usuario?.apellido1} ${c.usuario?.apellido2}`
                .toLowerCase()
                .includes(this.filtro().trim().toLowerCase());
            return byArticulo && byUsuario && bySearch;
          });

          const totalElements = filtered.length;
          const totalPages = Math.max(Math.ceil(totalElements / this.numRpp()), 1);
          const safePage = Math.min(this.numPage(), totalPages - 1);
          const pagedContent = filtered.slice(
            safePage * this.numRpp(),
            safePage * this.numRpp() + this.numRpp()
          );

          this.numPage.set(safePage);

          this.oPage.set({
            ...data,
            content: pagedContent,
            totalElements,
            totalPages,
            number: safePage,
            size: this.numRpp(),
            numberOfElements: pagedContent.length,
            first: safePage === 0,
            last: safePage === totalPages - 1,
          });

          if (this.numPage() > 0 && this.numPage() >= (data.totalPages ?? 0)) {
            this.numPage.set(Math.max((data.totalPages ?? 1) - 1, 0));
            this.getPage();
            return;
          }

          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage.set('No se pudo cargar la lista de carritos.');
          this.isLoading.set(false);
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

  onSearch(value: string) {
    this.searchSubject.next(value);
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
