import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IComentario } from '../model/comentario';
import { IPage } from '../model/plist';

@Injectable({
    providedIn: 'root'
})
export class ComentarioService {
    
    private readonly URL = `${serverURL}/comentario`;

    constructor(private oHttp: HttpClient) { }

    getPage(
        page: number,
        rpp: number,
        order: string = 'id',
        direction: string = 'asc',
        contenido: string = '',
        id_usuario: number = 0,
        id_noticia: number = 0
    ): Observable<IPage<IComentario>> {

        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', rpp.toString())
            .set('sort', `${order},${direction}`);

        if(contenido) {
            params = params.set('contenido', contenido);
            // return this.oHttp.get<IPage<IComentario>>(this.URL, { params });
        }

        if(id_usuario > 0) {
            params = params.set('id_usuario', id_usuario);
            // return this.oHttp.get<IPage<IComentario>>(this.URL, { params });
        }

        if(id_noticia > 0) {
            params = params.set('id_noticia', id_noticia);
            // return this.oHttp.get<IPage<IComentario>>(this.URL, { params });
        }

        return this.oHttp.get<IPage<IComentario>>(this.URL, { params });
    }

    count(): Observable<number> {
        return this.oHttp.get<number>(`${serverURL}/comentario/count`);
    }

    get(id: number): Observable<IComentario> {
        return this.oHttp.get<IComentario>(`${this.URL}/${id}`);
    }
}