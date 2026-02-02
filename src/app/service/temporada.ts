import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITemporada } from '../model/temporada';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TemporadaService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = '',
    id_club: number = 0,
  ): Observable<IPage<ITemporada>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    // Agregar ID como criterio secundario de ordenamiento
    const sortParams =
      order === 'id' ? `${order},${direction}` : `${order},${direction}&sort=id,asc`;

    if (id_club > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&id_club=${id_club}`,
      );
    }

    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<ITemporada>>(
        serverURL +
          `/temporada?page=${page}&size=${rpp}&sort=${sortParams}&descripcion=${descripcion}`,
      );
    }

    return this.oHttp.get<IPage<ITemporada>>(
      serverURL + `/temporada?page=${page}&size=${rpp}&sort=${sortParams}`,
    );
  }
}
