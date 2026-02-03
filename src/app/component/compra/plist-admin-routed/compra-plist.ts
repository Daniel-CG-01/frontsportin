import { Component, signal, computed, OnInit } from '@angular/core';
import { ICompra } from '../../../model/compra';
import { IPage } from '../../../model/plist';
import { CompraService } from '../../../service/compra';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../../pipe/trim-pipe';

@Component({
  selector: 'app-compra-plist',
  imports: [Paginacion, BotoneraRpp, TrimPipe, RouterLink],
  templateUrl: './compra-plist.html',
  styleUrl: './compra-plist.css',
})
export class CompraPlistAdminRouted implements OnInit {
  oPage = signal<IPage<ICompra> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // filtros
  articulo = signal<number>(0);
  factura = signal<number>(0);

  // mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  constructor(
    private oCompraService: CompraService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // CAMBIO CLAVE: Usamos subscribe en lugar de snapshot
    this.route.paramMap.subscribe((params) => {
      const idArticulo = params.get('articulo');
      const idFactura = params.get('factura');

      if (idArticulo) {
        this.articulo.set(+idArticulo);
        this.factura.set(0); // Reseteamos el otro filtro
      } else if (idFactura) {
        this.factura.set(+idFactura);
        this.articulo.set(0); // Reseteamos el otro filtro
      } else {
        this.articulo.set(0);
        this.factura.set(0);
      }
      
      this.numPage.set(0); // Volvemos a la primera página al filtrar
      this.getPage();
    });
  }

  getPage() {
    this.oCompraService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.articulo(),
        this.factura(),
      )
      .subscribe({
        next: (data: IPage<ICompra>) => {
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
}