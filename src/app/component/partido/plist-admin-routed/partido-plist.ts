import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { PartidoService } from '../../../service/partido';
import { IPartido } from '../../../model/partido';
import { IPage } from '../../../model/plist';
import { HttpErrorResponse } from '@angular/common/http';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';
import { TrimPipe } from '../../../pipe/trim-pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { debounceTimeSearch } from '../../../environment/environment';

@Component({
  selector: 'app-partido-plist-admin-routed',
  imports: [Paginacion, BotoneraRpp, TrimPipe, RouterLink],
  templateUrl: './partido-plist.html',
  styleUrl: './partido-plist.css',
})
export class PartidoPlistAdminRouted implements OnInit, OnDestroy {

  oPage = signal<IPage<IPartido> | null>(null);
  nPage = signal<number>(0);
  nRpp = signal<number>(10);
  strResult = signal<string>('');
  filter = signal<string>('');
  descripcion = signal<string>('');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  totalRecords = computed(() => this.oPage()?.totalElements ?? 0);
  sortField = signal<string>('id');
  sortDirection = signal<string>('asc');
  id_liga = signal<number | null>(null);

  constructor(private oPartidoService: PartidoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id_liga');
      if (id) {
        this.id_liga.set(+id);
      } else {
        this.id_liga.set(null);
      }
      this.nPage.set(0);
      this.getPage();
    });

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(debounceTimeSearch),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm: string) => {
        this.descripcion.set(searchTerm);
        this.nPage.set(0);
        this.getPage();
      });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  getPage() {
    let campoParaElServidor = this.sortField();
    
    if (this.sortField() === 'id_liga') {
        campoParaElServidor = 'liga.id';
    }

    this.oPartidoService.getPage(
      this.nPage(), 
      this.nRpp(), 
      campoParaElServidor, 
      this.sortDirection(), 
      this.descripcion(),
      this.id_liga() == null ? 0 : this.id_liga()!
    ).subscribe({
      next: (data: IPage<IPartido>) => {
        this.oPage.set(data);

        if (this.nPage() > 0 && this.nPage() >= data.totalPages) {
          this.nPage.set(data.totalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.strResult.set("Error al cargar: " + error.message);
        console.error(error);
      }
    });
  }

  onSetPage(nPage: number) {
    this.nPage.set(nPage);
    this.getPage();
  }

  onSetRpp(nRpp: number) {
    this.nRpp.set(nRpp);
    this.nPage.set(0);
    this.getPage();
  }

  onFilterChange(filter: string) {
    this.filter.set(filter);
    this.nPage.set(0);
    this.getPage();
  }

  onSearchDescription(value: string) {
    this.searchSubject.next(value);
  }

  setOrder(field: string) {
    this.sortField.set(field);
    this.sortDirection.update(current => current === 'asc' ? 'desc' : 'asc');
    this.getPage();
  }
}