import { Injectable } from '@angular/core';
import { ICategoria } from '../model/categoria';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    nombre: string = '',
    id_temporada: number = 0,
  ): Observable<IPage<ICategoria>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    // Filtro por temporada tiene prioridad
    if (id_temporada > 0) {
      return this.oHttp.get<IPage<ICategoria>>(
        serverURL + `/categoria?page=${page}&size=${rpp}&sort=${order},${direction}&id_temporada=${id_temporada}`
      );
    }

    // Filtro por nombre
    if (nombre && nombre.length > 0) {
      return this.oHttp.get<IPage<ICategoria>>(
        serverURL + `/categoria?page=${page}&size=${rpp}&sort=${order},${direction}&nombre=${nombre}`
      );
    }

    // Sin filtros
    return this.oHttp.get<IPage<ICategoria>>(
      serverURL + `/categoria?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }

  // Get de categoría por id
  get(id: number): Observable<ICategoria> {
    return this.oHttp.get<ICategoria>(`${serverURL}/categoria/${id}`);
  }

  // Obtener el conteo total de categorías
  count(): Observable<number> {
    return this.oHttp.get<number>(`${serverURL}/categoria/count`);
  }
}
