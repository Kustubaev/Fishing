import { Component, inject, Input } from '@angular/core';
import {
  BestResultWithPlayer,
  HttpService,
  Player,
} from '../../service/http.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
})
export class RatingComponent {
  @Input() bestResultWithPlayer: BestResultWithPlayer | null = null;
}
