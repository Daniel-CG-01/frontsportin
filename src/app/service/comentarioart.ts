import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IComentarioart } from '../model/comentarioart';
import { IPage } from '../model/plist';
import { serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ComentarioartService {

    constructor(private oHttp: HttpClient) {        
    }

    getPage(
        page: number,
        rpp: number,
        order: string = '',
        direction: string = '',
        contenido: string = '',
        id_articulo: number = 0,
        id_usuario: number = 0,
    ): Observable<IPage<IComentarioart>> {
        if (order === '') {
            order = 'id';
        }

        if (direction === '') {
            direction = 'asc';
        }
        
        // Filtrar por el ID de ARTICULO
        if (id_articulo > 0) {
            return this.oHttp.get<IPage<IComentarioart>>(
                serverURL +
                `/comentarioart?page=${page}&size=${rpp}&sort=${order},${direction}&id_articulo=${id_articulo}`,
            );
        }

        // Filtrar por el ID de USUARIO
        if (id_usuario > 0) {
            return this.oHttp.get<IPage<IComentarioart>>(
                serverURL +
                `/comentarioart?page=${page}&size=${rpp}&sort=${order},${direction}&id_usuario=${id_usuario}`,
            );
        }
        
        // Búsqueda por CONTENIDO
        if (contenido && contenido.length > 0) {
        return this.oHttp.get<IPage<IComentarioart>>(
            serverURL +
            `/comentarioart?page=${page}&size=${rpp}&sort=${order},${direction}&contenido=${contenido}`,
        );
        }
        
        // Sin filtros
        return this.oHttp.get<IPage<IComentarioart>>(
            serverURL + `/comentarioart?page=${page}&size=${rpp}&sort=${order},${direction}`,
        );
    }

    getById(id: number): Observable<IComentarioart> {
        return this.oHttp.get<IComentarioart>(
            serverURL + `/comentarioart/${id}`
        );
    }

    get(id: number): Observable<IComentarioart> {
        return this.oHttp.get<IComentarioart>(
            serverURL + `/comentarioart/${id}`
        );
    }

    count(): Observable<number> {
        return this.oHttp.get<number>(serverURL + '/comentarioart/count');
    }

    update(comentarioart: Partial<IComentarioart>): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/comentarioart', comentarioart);
    }

    delete(id: number): Observable<number> {
        return this.oHttp.delete<number>(serverURL + '/comentarioart/' + id);
    }
}
