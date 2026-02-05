import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { IClub } from '../model/club';
import { IPage } from '../model/plist';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  private http = inject(HttpClient);
  private url = `${serverURL}/club`;

  get(id: number): Observable<IClub> {
    return this.http.get<IClub>(`${this.url}/${id}`);
  }

  getPage(
    page: number,
    size: number,
    sort: string = 'id',
    direction: string = 'asc'
  ): Observable<IPage<IClub>> {
    return this.http.get<IPage<IClub>>(
      `${this.url}?page=${page}&size=${size}&sort=${sort},${direction}`
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.url}/count`);
  }
}
