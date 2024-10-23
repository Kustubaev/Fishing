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

export interface BestResultWithPlayer {
  array: ResultPlayer[];
  player: ResultPlayer | null;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl = 'http://localhost:4444/';

  // resultPlayer$ = new BehaviorSubject<ResultPlayer | null>(null);
  bestResultWithPlayer$ = new BehaviorSubject<BestResultWithPlayer | null>(
    null
  );

  getBestResultWithPlayer(): Observable<BestResultWithPlayer | null> {
    return this.bestResultWithPlayer$.asObservable();
  }

  getRating(): any {
    return this.http.get<Player[]>(`${this.baseApiUrl}results`);
  }

  uploadResult(result: Rating) {
    this.http
      .post<ResultPlayer>(`${this.baseApiUrl}result`, result)
      .subscribe((player) => {
        this.getRating().subscribe((array: Player[]) => {
          const arrayRating = array.slice(0, 10).map((el, index) => {
            return { player: el, position: index + 1 };
          });

          if (player && player?.position > 10) {
            arrayRating.pop();
            arrayRating.push(player);
            arrayRating.sort((a, b) => a.position - b.position);
          }

          this.bestResultWithPlayer$.next({ array: arrayRating, player });
        });
      });
  }

  //Оно есть но пока не используется
  getPosition(id: string): any {
    return this.http.get<number>(`${this.baseApiUrl}position/${id}`);
  }

  constructor() {}
}
