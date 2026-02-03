import { Component, signal, computed } from '@angular/core';
import { IPage } from '../../../model/plist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { IPuntuacion } from '../../../model/puntuacion';
import { PuntuacionService } from '../../../service/puntuacion';

@Component({
  selector: 'app-puntuacion-plist',
  imports: [Paginacion, BotoneraRpp, TrimPipe, RouterLink],
  templateUrl: './puntuacion-plist.html',
  styleUrl: './puntuacion-plist.css',
})
export class PuntuacionPlistAdminRouted {
  oPage = signal<IPage<IPuntuacion> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(5);

  // Mensajes y total
  message = signal<string | null>(null);
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);

  // Variables de ordenamiento
  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');

  // Variables de filtro
  noticia = signal<number>(0);
  usuario = signal<number>(0);

  constructor(
    private oPuntuacionService: PuntuacionService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const idUsuario = this.route.snapshot.paramMap.get('usuario');
    if (idUsuario) {
      this.usuario.set(+idUsuario);
    }

    const idNoticia = this.route.snapshot.paramMap.get('noticia');
    if (idNoticia) {
      this.noticia.set(+idNoticia);
    }

    this.getPage();
  }

  getPage() {
    this.oPuntuacionService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.noticia(),
        this.usuario(),
      )
      .subscribe({
        next: (data: IPage<IPuntuacion>) => {
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
