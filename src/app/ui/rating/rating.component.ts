import { Component, inject } from '@angular/core';
import { HttpService, ResultPlayer } from '../../service/http.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  public arrayRating: ResultPlayer[] = [];
  public resultPlayer: ResultPlayer | null = null;

  http = inject(HttpService);

  constructor() {
    this.reload();

    this.http.getCurrentResult().subscribe((val) => {
      this.resultPlayer = val;
      this.reload();
    });
  }

  reload() {
    this.http.getRating().subscribe((val: any[]) => {
      this.arrayRating = val.slice(0, 10).map((el, index) => {
        return { player: el, position: index + 1 };
      });

      console.log(this.arrayRating[this.arrayRating.length - 1]);

      if (this.resultPlayer && this.resultPlayer?.position > 10) {
        this.arrayRating.pop();
        this.arrayRating.push(this.resultPlayer);
        this.arrayRating.sort((a, b) => a.position - b.position);
      }
    });
  }
}
