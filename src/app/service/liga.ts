import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../model/plist';
import { Observable } from 'rxjs';
import { ILiga } from '../model/liga';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LigaService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    nombre: string = '',
    id_equipo: number = 0,
  ): Observable<IPage<ILiga>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_equipo > 0) {
      return this.oHttp.get<IPage<ILiga>>(
        serverURL +
          `/liga?page=${page}&size=${rpp}&sort=${order},${direction}&id_equipo=${id_equipo}`,
      );
    }
    if (nombre && nombre.length > 0) {
      return this.oHttp.get<IPage<ILiga>>(
        serverURL + `/liga?page=${page}&size=${rpp}&sort=${order},${direction}&nombre=${nombre}`,
      );
    }
    return this.oHttp.get<IPage<ILiga>>(
      serverURL + `/liga?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/liga/count');
  }

  get(id: number): Observable<ILiga> {
    return this.oHttp.get<ILiga>(serverURL + `/liga/${id}`);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/liga/' + id);
  }
  update(liga: Partial<ILiga>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/liga', liga);
  }
}
