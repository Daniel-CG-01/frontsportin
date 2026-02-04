import { Injectable } from '@angular/core';
import { IArticulo } from '../model/articulo';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_tipoarticulo: number = 0,
  ): Observable<IPage<IArticulo>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_tipoarticulo > 0) {
      return this.oHttp.get<IPage<IArticulo>>(
        serverURL +
          `/articulo?page=${page}&size=${rpp}&sort=${order},${direction}&id_tipoarticulo=${id_tipoarticulo}`,
      );
    }
    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<IArticulo>>(
        serverURL +
          `/articulo?page=${page}&size=${rpp}&sort=${order},${direction}&descripcion=${descripcion}`,
      );
    }
    return this.oHttp.get<IPage<IArticulo>>(
      serverURL + `/articulo?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  get(id: number): Observable<IArticulo> {
    return this.oHttp.get<IArticulo>(serverURL + '/articulo/' + id);
   }

  // create(articulo: Partial<IArticulo>): Observable<number> {
  //   return this.oHttp.post<number>(serverURL + '/articulo', articulo);
  // }

  // update(articulo: Partial<IArticulo>): Observable<number> {
  //   return this.oHttp.put<number>(serverURL + '/articulo', articulo);
  // }

  // delete(id: number): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/articulo/' + id);
  // }

  // empty(): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/articulo/empty');
  // }

  //   publicar(id: number): Observable<number> {
  //     return this.oHttp.put<number>(serverURL + '/articulo/publicar/' + id, {});
  //   }

  //   despublicar(id: number): Observable<number> {
  //     return this.oHttp.put<number>(serverURL + '/articulo/despublicar/' + id, {});
  //   }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/articulo/count');
  }
}
