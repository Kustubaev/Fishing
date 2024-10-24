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
  position: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ResultArray {
  array: Player[] | null;
  message: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl = 'http://localhost:4444/';

  // Универсальный запрос
  resultArray(body?: Rating): any {
    return this.http.post<ResultArray>(`${this.baseApiUrl}resultArray`, body);
  }

  constructor() {}
}
