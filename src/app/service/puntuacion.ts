import { Injectable } from '@angular/core';
import { IPuntuacion } from '../model/puntuacion';
import { Observable } from 'rxjs';
import { IPage } from '../model/plist';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PuntuacionService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = '',
    id_noticia: number = 0,
    id_usuario: number = 0,
  ): Observable<IPage<IPuntuacion>> {

    if (order === '') {
      order = 'id';
    }

    if (direction === '') {
      direction = 'asc';
    }

    if (id_noticia > 0) {
      return this.oHttp.get<IPage<IPuntuacion>>(
        serverURL +
          `/puntuacion?page=${page}&size=${rpp}&sort=${order},${direction}&id_noticia=${id_noticia}`,
      );
    }

    if (id_usuario > 0) {
      return this.oHttp.get<IPage<IPuntuacion>>(
        serverURL +
          `/puntuacion?page=${page}&size=${rpp}&sort=${order},${direction}&id_usuario=${id_usuario}`,
      );
    }

    return this.oHttp.get<IPage<IPuntuacion>>(
      serverURL + `/puntuacion?page=${page}&size=${rpp}&sort=${order},${direction}`,
    );
  }

  get(id: number): Observable<IPuntuacion> {
    return this.oHttp.get<IPuntuacion>(serverURL + '/puntuacion/' + id);
  }

  // create(puntuacion: Partial<IPuntuacion>): Observable<number> {
  //   return this.oHttp.post<number>(serverURL + '/puntuacion', puntuacion);
  // }

  // update(puntuacion: Partial<IPuntuacion>): Observable<number> {
  //   return this.oHttp.put<number>(serverURL + '/puntuacion', puntuacion);
  // }

  // delete(id: number): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/puntuacion/' + id);
  // }

  // empty(): Observable<number> {
  //   return this.oHttp.delete<number>(serverURL + '/puntuacion/empty');
  // }

  //   publicar(id: number): Observable<number> {
  //     return this.oHttp.put<number>(serverURL + '/puntuacion/publicar/' + id, {});
  //   }

  //   despublicar(id: number): Observable<number> {
  //     return this.oHttp.put<number>(serverURL + '/puntuacion/despublicar/' + id, {});
  //   }
}
