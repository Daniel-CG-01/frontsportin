import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IJugador } from '../model/jugador';
import { IPage } from '../model/plist';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  constructor(private http: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    posicion: string = '',
    id_usuario: number = 0,
    id_equipo: number = 0,
  ): Observable<IPage<IJugador>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    
    let url = '';
    
    if (id_usuario > 0) {
      url = serverURL + `/jugador?page=${page}&size=${rpp}&sort=${order},${direction}&id_usuario=${id_usuario}`;
      console.log('URL filtro usuario:', url);
      return this.http.get<IPage<IJugador>>(url);
    }
    if (id_equipo > 0) {
      url = serverURL + `/jugador?page=${page}&size=${rpp}&sort=${order},${direction}&id_equipo=${id_equipo}`;
      console.log('URL filtro equipo:', url);
      return this.http.get<IPage<IJugador>>(url);
    }
    if (posicion && posicion.length > 0) {
      url = serverURL + `/jugador?page=${page}&size=${rpp}&sort=${order},${direction}&posicion=${posicion}`;
      console.log('URL filtro posición:', url);
      return this.http.get<IPage<IJugador>>(url);
    }
    
    url = serverURL + `/jugador?page=${page}&size=${rpp}&sort=${order},${direction}`;
    console.log('URL sin filtros:', url);
    return this.http.get<IPage<IJugador>>(url);
  }

  getById(id: number): Observable<IJugador> {
    return this.http.get<IJugador>(serverURL + '/jugador/' + id);
  }

  // create(jugador: Partial<IJugador>): Observable<number> {
  //   return this.http.post<number>(serverURL + '/jugador', jugador);
  // }

  // update(jugador: Partial<IJugador>): Observable<number> {
  //   return this.http.put<number>(serverURL + '/jugador', jugador);
  // }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(serverURL + '/jugador/' + id);
  }

  // empty(): Observable<number> {
  //   return this.http.delete<number>(serverURL + '/jugador/empty');
  // }

  count(): Observable<number> {
    return this.http.get<number>(serverURL + '/jugador/count');
  }
}
