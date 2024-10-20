import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { GameStatusService } from '../../service/game-status.service';
import { FishComponent } from '../fish/fish.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

const TIMER: number = 10 - 1; // -1 так как для проверки остается 1 секунда

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [FishComponent, SvgIconComponent],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  host: {
    '(document:keyup.space)': 'pause($event)',
  },
})
export class CanvasComponent {
  @ViewChild('Container', { static: true }) container!: ElementRef;
  @ViewChild('Timer', { static: true }) timerHTML!: ElementRef;
  public isPaused: boolean = false;
  public isGameOver: boolean = false;
  public width: number = 1380;
  public height: number = 830;
  public countdown = TIMER; // Установка времени игры
  public resultSum: number = 0;
  private timer: any;
  protected gameStatusService = inject(GameStatusService);

  ngOnInit() {
    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;
    this.startTimer();
  }

  public pause(event: any) {
    console.log('pause', this.isPaused, this.isGameOver, event);
    // console.log('pause', this.isPaused, this.isGameOver, event?.pointerType);

    this.isPaused = !this.isPaused;
    this.gameStatusService.setPause(this.isPaused);
  }

  public reload() {
    this.resultSum = 0;
    this.countdown = TIMER;
    this.isPaused = false;
    this.isGameOver = false;
    this.gameStatusService.setGameOver(this.isGameOver);
    clearInterval(this.timer);
    this.startTimer();
  }

  startTimer() {
    if (this.countdown >= 0) {
      this.timer = setInterval(() => {
        if (!this.isPaused) {
          this.countdown--;
          if (this.countdown < 0) {
            clearInterval(this.timer);
            this.isGameOver = true;
            this.gameStatusService.setGameOver(this.isGameOver);
          }
        }
      }, 1000);
    } else {
      this.isGameOver = true;
      this.gameStatusService.setGameOver(this.isGameOver);
    }
  }

  formatTime(seconds: number): string {
    const minutes: string = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const remainingSeconds: string = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }
}
