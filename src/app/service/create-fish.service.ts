import { Injectable } from '@angular/core';

export interface Fish {
  width: number;
  height: number;
  points: number;
  time: number;
  color: string;
}

const SizeFish: Fish[] = [
  {
    width: 200,
    height: 100,
    points: 10,
    time: 5000,
    color: '#84c692',
  },
  {
    width: 150,
    height: 75,
    points: 20,
    time: 3500,
    color: '#8490c6',
  },
  {
    width: 100,
    height: 50,
    points: 30,
    time: 2500,
    color: '#c68484',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CreateFishService {
  constructor() {}

  public sizeFish() {
    const randomNumber = Math.random() * 10;
    if (randomNumber < 6) {
      return SizeFish[0]; // Вероятность 60%
    } else if (randomNumber < 9) {
      return SizeFish[1]; // Вероятность 30%
    } else {
      return SizeFish[2]; // Вероятность 10%
    }
  }

  public bezier(startX: number, endX: number, startY: number, endY: number) {
    const aP = this.randomPositionsBezier(startX, endX, startY, endY);
    const step = 0.02;
    let x, y;
    let arrayCoordinates = [];
    for (let t = 0; t <= 1 + step; t += step) {
      x =
        Math.round(
          (Math.pow(1 - t, 3) * aP[0].x +
            3 * t * Math.pow(1 - t, 2) * aP[1].x +
            3 * Math.pow(t, 2) * (1 - t) * aP[2].x +
            Math.pow(t, 3) * aP[3].x) *
            1000
        ) / 1000;
      y =
        Math.round(
          (Math.pow(1 - t, 3) * aP[0].y +
            3 * t * Math.pow(1 - t, 2) * aP[1].y +
            3 * Math.pow(t, 2) * (1 - t) * aP[2].y +
            Math.pow(t, 3) * aP[3].y) *
            1000
        ) / 1000;

      arrayCoordinates.push({ x, y });
    }
    if(Math.random() > 0.5) arrayCoordinates.reverse();
    return arrayCoordinates;
  }

  private randomPositionsBezier(
    startX: number,
    endX: number,
    startY: number,
    endY: number
  ) {
    const deltaX = endX - startX;
    const deltaY = endY + startY;
    return [
      { x: startX, y: Math.floor(Math.random() * deltaY + 1) },
      {
        x: Math.floor(Math.random() * deltaX * 0.36) + deltaX * 0.1,
        y: Math.floor(Math.random() * deltaY + 1),
      },
      {
        x: Math.floor(Math.random() * deltaX * 0.36) + deltaX * 0.55,
        y: Math.floor(Math.random() * deltaY + 1),
      },
      { x: endX, y: Math.floor(Math.random() * deltaY + 1) },
    ];
  }
}
