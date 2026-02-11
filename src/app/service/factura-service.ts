import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';
import { IFactura } from '../model/factura';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(private oHttp: HttpClient) {}

  getPage(page: number, rpp: number, order: string = '', direction: string = '', id_usuario: number = 0): Observable<IPage<IFactura>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_usuario > 0) {
      return this.oHttp.get<IPage<IFactura>>(
        serverURL + 
        `/factura?page=${page}&size=${rpp}&sort=${order},${direction}&id_usuario=${id_usuario}`,
      );
    }
    return this.oHttp.get<IPage<IFactura>>(
      serverURL + `/factura?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }

  get(id: number): Observable<IFactura> {
    return this.oHttp.get<IFactura>(`${serverURL}/factura/${id}`);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/factura/' + id);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/factura/count');
  }

  update(factura: Partial<IFactura>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/factura', factura);
  } 
}