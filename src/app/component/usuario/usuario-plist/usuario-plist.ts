import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IPage } from '../../../model/plist';
import { IUsuario } from '../../../model/usuario';
import { UsuarioService } from '../../../service/usuarioService';

import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { debounceTimeSearch } from '../../../environment/environment';

@Component({
  selector: 'app-usuario-plist',
  standalone: true,
  imports: [CommonModule, RouterLink, Paginacion, BotoneraRpp],
  templateUrl: './usuario-plist.html',
  styleUrl: './usuario-plist.css',
})
export class UsuarioPlist {
  oPage = signal<IPage<IUsuario> | null>(null);
  numPage = signal<number>(0);
  numRpp = signal<number>(10);


  orderField = signal<string>('id');
  orderDirection = signal<'asc' | 'desc'>('asc');


  filtro = signal<string>('');
  idTipousuario = signal<number>(0);
  idRol = signal<number>(0);
  idClub = signal<number>(0);


  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  isFilling = signal<boolean>(false);
  fillErrorMessage = signal<string>('');
  fillAmount = signal<number>(25);

 
  totalElementsCount = computed(() => this.oPage()?.totalElements ?? 0);


  private routeSub?: Subscription;


  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private oUsuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.routeSub = this.route.params.subscribe((params) => {
      this.idTipousuario.set(params['tipousuario'] ? Number(params['tipousuario']) : 0);
      this.idRol.set(params['rol'] ? Number(params['rol']) : 0);
      this.idClub.set(params['club'] ? Number(params['club']) : 0);

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

    this.oUsuarioService
      .getPage(
        this.numPage(),
        this.numRpp(),
        this.orderField(),
        this.orderDirection(),
        this.filtro().trim(),
        this.idTipousuario(),
        this.idRol(),
        this.idClub()
      )
      .subscribe({
        next: (data: IPage<IUsuario>) => {
          this.oPage.set(data);

          // si la página se queda fuera por un borrado, etc.
          if (this.numPage() > 0 && this.numPage() >= (data.totalPages ?? 0)) {
            this.numPage.set(Math.max((data.totalPages ?? 1) - 1, 0));
            this.getPage();
            return;
          }

          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage.set('No se pudo cargar la lista de usuarios.');
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

  setFillAmount(value: string) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.fillAmount.set(parsed);
    }
  }

  fillUsuarios() {
    if (this.isFilling()) return;

    this.isFilling.set(true);
    this.fillErrorMessage.set('');

    this.oUsuarioService.fill(this.fillAmount()).subscribe({
      next: () => {
        this.isFilling.set(false);
        this.getPage();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.fillErrorMessage.set('No se pudieron rellenar usuarios.');
        this.isFilling.set(false);
      },
    });
  }

  trackById(index: number, usuario: IUsuario) {
    return usuario.id;
  }

  getGeneroLabel(genero: number) {
    return genero === 0 ? 'H' : 'M';
  }
}
