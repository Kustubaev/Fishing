import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Rating {
  name: string;
  value: number;
}

export interface Player {
  _id: string;
  name: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ResultPlayer {
  player: Player;
  position: number;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl = 'http://localhost:4444/';

  resultPlayer$ = new BehaviorSubject<ResultPlayer | null>(null);

  getCurrentResult(): Observable<ResultPlayer | null> {
    return this.resultPlayer$.asObservable();
  }

  getRating(): any {
    return this.http.get<Player[]>(`${this.baseApiUrl}results`);
  }

  uploadResult(result: Rating) {
    this.http
      .post<ResultPlayer>(`${this.baseApiUrl}result`, result)
      .subscribe((val) => {
        this.resultPlayer$.next(val);
      });
  }

  //Оно есть но пока не используется
  getPosition(id: string): any {
    return this.http.get<number>(`${this.baseApiUrl}position/${id}`);
  }

  constructor() {}
}
