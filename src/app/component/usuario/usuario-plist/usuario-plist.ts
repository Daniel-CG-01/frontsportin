import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IPage } from '../../../model/plist';
import { IUsuario } from '../../../model/usuario';
import { UsuarioService } from '../../../service/usuarioService';
import { UsuarioSharedModule } from './usuario-shared.module';

@Component({
  selector: 'app-usuario-plist',
  imports: [CommonModule, RouterLink, UsuarioSharedModule],
  templateUrl: './usuario-plist.html',
  styleUrl: './usuario-plist.css',
  standalone: true
})
export class UsuarioPlist implements OnInit, OnDestroy {
  oPage: IPage<IUsuario> | null = null;
  numPage: number = 0;
  numRpp: number = 10;
  filtro: string = '';
  orderField: string = 'id';
  isLoading: boolean = false;
  isFilling: boolean = false;
  errorMessage: string = '';
  fillErrorMessage: string = '';
  totalElementsCount: number = 0;
  fillAmount: number = 25;
  orderDirection: 'asc' | 'desc' = 'asc';

  idTipousuario: number = 0;
  idRol: number = 0;
  idClub: number = 0;

  private routeSub?: Subscription;

  constructor(
    private oUsuarioService: UsuarioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.idTipousuario = params['tipousuario'] ? Number(params['tipousuario']) : 0;
      this.idRol = params['rol'] ? Number(params['rol']) : 0;
      this.idClub = params['club'] ? Number(params['club']) : 0;
      this.numPage = 0;
      this.getPage();
    });

    if (!this.routeSub) {
      this.getPage();
    }
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  getPage() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.oUsuarioService
      .getPage(
        this.numPage,
        this.numRpp,
        this.orderField,
        this.orderDirection,
        this.filtro.trim(),
        this.idTipousuario,
        this.idRol,
        this.idClub
      )
      .subscribe({
        next: (data: IPage<IUsuario>) => {
          this.oPage = data;
          this.totalElementsCount = data.totalElements ?? 0;
          if (this.numPage > 0 && this.numPage >= data.totalPages) {
            this.numPage = data.totalPages - 1;
            this.getPage();
            return;
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage = 'No se pudo cargar la lista de usuarios.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onOrder(order: string) {
    if (this.orderField === order) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderField = order;
      this.orderDirection = 'asc';
    }
    this.numPage = 0;
    this.getPage();
  }

  onSearch(value: string) {
    this.filtro = value;
    this.numPage = 0;
    this.getPage();
  }

  setFillAmount(value: string) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.fillAmount = parsed;
    }
  }

  fillUsuarios() {
    if (this.isFilling) {
      return;
    }
    this.isFilling = true;
    this.fillErrorMessage = '';
    this.cdr.markForCheck();

    this.oUsuarioService.fill(this.fillAmount).subscribe({
      next: () => {
        this.isFilling = false;
        this.getPage();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.fillErrorMessage = 'No se pudieron rellenar usuarios.';
        this.isFilling = false;
        this.cdr.markForCheck();
      }
    });
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.getPage();
  }

  onRppChange(n: number) {
    this.numRpp = n;
    this.numPage = 0;
    this.getPage();
  }

  trackById(index: number, usuario: IUsuario) {
    return usuario.id;
  }

  getGeneroLabel(genero: number) {
    return genero === 0 ? 'H' : 'M';
  }
}
