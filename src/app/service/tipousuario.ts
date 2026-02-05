import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '../environment/environment';
import { ITipousuario } from '../model/tipousuario';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TipousuarioService {
    constructor(private httpClient: HttpClient) { }
 
    getAll(): Observable<ITipousuario[]> {
        return this.httpClient.get<ITipousuario[]>(`${serverURL}/tipousuario`);
    }

    count(): Observable<number> {
        return this.httpClient.get<number>(`${serverURL}/tipousuario/count`);
    }

      // get para obtener un solo tipousuario
  get(id: number): Observable<ITipousuario> {
    return this.httpClient.get<ITipousuario>(`${serverURL}/tipousuario/${id}`);
  }

}
