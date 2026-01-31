import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IRolusuario } from '../model/rolusuario';
import { IPage } from '../model/plist';

@Injectable({
  providedIn: 'root',
})
export class RolusuarioService {

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    descripcion: string = ''
  ): Observable<IPage<IRolusuario>> {

    if (order === '') {
      order = 'id';
    }

    if (direction === '') {
       direction = 'asc';
    }

    let params =
      `page=${page}&size=${rpp}&sort=${order},${direction}`;

    if (descripcion !== '') {
      params += `&descripcion=${descripcion}`;
    }

    if (descripcion && descripcion.length > 0) {
      return this.oHttp.get<IPage<IRolusuario>>(
        serverURL +
        `/rolusuario?page=${page}&size=${rpp}&sort=${order},${direction}&descripcion=${descripcion}`,
      );
    }

    return this.oHttp.get<IPage<IRolusuario>>(
      serverURL + '/rolusuario?' + params
    );
  }

  // get(id: number): Observable<IRolusuario> {
  //   return this.oHttp.get<IRolusuario>(serverURL + '/rolusuario/' + id);
  // }

}
