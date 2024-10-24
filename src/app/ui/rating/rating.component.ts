import { Component, Input } from '@angular/core';
import { ResultArray } from '../../service/http.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  @Input() resultArray: ResultArray | null = null;
}
