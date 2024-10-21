import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStatusService {
  public gameOver$ = new BehaviorSubject<boolean>(true);
  public pause$ = new BehaviorSubject<boolean>(false);

  setGameOver(flag: boolean): void {
    console.log('gameOver', flag);

    this.gameOver$.next(flag);
  }

  getGameOver(): Observable<boolean> {
    return this.gameOver$.asObservable();
  }

  setPause(flag: boolean): void {
    this.pause$.next(flag);
  }

  getPause(): Observable<boolean> {
    return this.pause$.asObservable();
  }
}
