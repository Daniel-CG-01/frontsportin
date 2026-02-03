import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { ICompra } from '../model/compra';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    id_articulo: number = 0,
    id_factura: number = 0,
  ): Observable<IPage<ICompra>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    const params = `?page=${page}&size=${rpp}&sort=${order},${direction}${
      id_articulo > 0 ? `&id_articulo=${id_articulo}` : ''
    }${id_factura > 0 ? `&id_factura=${id_factura}` : ''}`;

    return this.oHttp.get<IPage<ICompra>>(serverURL + `/compra` + params);
  }
}
