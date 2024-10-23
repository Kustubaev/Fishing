import { Injectable } from '@angular/core';

export interface Fish {
  width: number;
  points: number;
  time: number;
  color: string;
}

const SizeFish: Fish[] = [
  {
    width: 10,
    points: 10,
    time: 5000,
    color: '#84c692',
  },
  {
    width: 7,
    points: 20,
    time: 3500,
    color: '#8490c6',
  },
  {
    width: 5,
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

  public bezier(width: number) {
    const aP = this.randomPositionsBezier(width);
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
    if (Math.random() > 0.5) arrayCoordinates.reverse();
    return arrayCoordinates;
  }

  private randomPositionsBezier(
    width: number,
  ) {
    const allX = 100 + width*2;
    const allY = 100 - width;
    return [
      { x: -width, y: Math.floor(Math.random() * allY + 1) },
      {
        x: Math.floor(Math.random() * allX * 0.36) + allX * 0.1,
        y: Math.floor(Math.random() * allY + 1),
      },
      {
        x: Math.floor(Math.random() * allX * 0.36) + allX * 0.55,
        y: Math.floor(Math.random() * allY + 1),
      },
      { x: 100+width, y: Math.floor(Math.random() * allY + 1) },
    ];
  }
}
