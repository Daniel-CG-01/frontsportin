import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ICarrito } from '../model/carrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    filter: string = '',
    _idArticulo: number = 0,
    _idUsuario: number = 0,
  ): Observable<IPage<ICarrito>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }

    let url = `${serverURL}/carrito?page=${page}&size=${rpp}&sort=${order},${direction}`;

    if (filter && filter.length > 0) {
      url += `&filter=${encodeURIComponent(filter)}`;
    }

    if (_idArticulo > 0) {
      url += `&id_articulo=${_idArticulo}`;
    }

    if (_idUsuario > 0) {
      url += `&id_usuario=${_idUsuario}`;
    }

    return this.oHttp.get<IPage<ICarrito>>(url);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(`${serverURL}/carrito/count`);
  }

  private carritoURL = `${serverURL}/carrito`;

  getById(id: number) {
    return this.oHttp.get<ICarrito>(`${this.carritoURL}/${id}`);
  }

  get(id: number): Observable<ICarrito> {
    return this.oHttp.get<ICarrito>(`${this.carritoURL}/${id}`);
  }

  update(carrito: Partial<ICarrito>): Observable<number> {
    return this.oHttp.put<number>(this.carritoURL, carrito);
  }

  delete(id: number) {
    return this.oHttp.delete<number>(`${this.carritoURL}/${id}`);
  }
}
