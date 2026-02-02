import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { IPartido } from '../model/partido';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    filter: string = '',
    id_liga: number | null = null // Cambiado a null por defecto para ser más claro
  ): Observable<IPage<IPartido>> {
    
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    // 1. Prioridad: Filtro por Liga (El embudo)
    if (id_liga && id_liga > 0) {
      return this.oHttp.get<IPage<IPartido>>(
        serverURL +
        `/partido?page=${page}&size=${rpp}&sort=${order},${direction}&id_liga=${id_liga}` // 'liga' es el nombre que espera tu Java
      );
    }

    // 2. Prioridad: Filtro por Texto (El buscador)
    if (filter && filter.length > 0) {
      return this.oHttp.get<IPage<IPartido>>(
        serverURL +
        `/partido?page=${page}&size=${rpp}&sort=${order},${direction}&filter=${filter}`
      );
    }

    // 3. Sin filtros: Devuelve todo
    return this.oHttp.get<IPage<IPartido>>(
      serverURL + `/partido?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }
}