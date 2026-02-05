import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../model/plist';
import { ITipoarticulo } from '../model/tipoarticulo';
import { serverURL } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TipoarticuloService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_club: number = 0,
  ): Observable<IPage<ITipoarticulo>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    if (id_club > 0) {
      return this.oHttp.get<IPage<ITipoarticulo>>(
        serverURL +
          `/tipoarticulo?page=${page}&size=${rpp}&sort=${order},${direction}&id_club=${id_club}`,
      );
    }
    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ITipoarticulo>>(
        serverURL +
          `/tipoarticulo?page=${page}&size=${rpp}&sort=${order},${direction}&descripcion=${descripcion}`,
      );
    }
    return this.oHttp.get<IPage<ITipoarticulo>>(
      serverURL + `/tipoarticulo?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  get(id: number): Observable<ITipoarticulo> {
    return this.oHttp.get<ITipoarticulo>(`${serverURL}/tipoarticulo/${id}`);
  }

  count(): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/tipoarticulo/count');
  }
}
