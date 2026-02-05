import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPago } from '../model/pago';
import { IPage } from '../model/plist';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  constructor(private http: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    id_cuota: number = 0,
    id_jugador: number = 0,
  ): Observable<IPage<IPago>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    let url = '';

    if (id_cuota > 0) {
      url =
        serverURL +
        `/pago?page=${page}&size=${rpp}&sort=${order},${direction}&id_cuota=${id_cuota}`;
      console.log('URL filtro cuota:', url);
      return this.http.get<IPage<IPago>>(url);
    }
    if (id_jugador > 0) {
      url =
        serverURL +
        `/pago?page=${page}&size=${rpp}&sort=${order},${direction}&id_jugador=${id_jugador}`;
      console.log('URL filtro jugador:', url);
      return this.http.get<IPage<IPago>>(url);
    }

    url = serverURL + `/pago?page=${page}&size=${rpp}&sort=${order},${direction}`;
    console.log('URL sin filtros:', url);
    return this.http.get<IPage<IPago>>(url);
  }

  get(id: number): Observable<IPago> {
    return this.http.get<IPago>(`${serverURL}/pago/${id}`);
  }

  count(): Observable<number> {
    return this.http.get<number>(serverURL + '/pago/count');
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(serverURL + '/pago/' + id);
  }
}
