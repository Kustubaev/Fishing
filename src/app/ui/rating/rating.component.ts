import { Component } from '@angular/core';

interface Rating {
  name: string;
  value: number;
}

const dataRating: Rating[] = [
  { name: 'Oleg', value: 510 },
  { name: 'Anna', value: 700 },
  { name: 'Dmitry', value: 300 },
  { name: 'Elena', value: 900 },
  { name: 'Ivan', value: 450 },
  { name: 'Marina', value: 600 },
  { name: 'Sergey', value: 350 },
  { name: 'Natalia', value: 800 },
  { name: 'Pavel', value: 420 },
  { name: 'Igor', value: 430 },
  { name: 'Viktor', value: 500 },
  { name: 'Daria', value: 400 },
  { name: 'Alexey', value: 550 },
  { name: 'Anna', value: 710 },
];

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  public arrayRating: Rating[] = [];

  constructor() {
    this.arrayRating = [...dataRating]
      .sort((a, b) => {
        return b.value - a.value;
      })
      .slice(0, 10);
  }
}
