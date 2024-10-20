import { Component } from '@angular/core';
import { CanvasComponent } from "../../ui/canvas/canvas.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CanvasComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

}
