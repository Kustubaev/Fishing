import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CreateFishService, Fish } from '../../service/create-fish.service';
import { GameStatusService } from '../../service/game-status.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-fish',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './fish.component.html',
  styleUrl: './fish.component.scss',
})
export class FishComponent {
  @Input() index!: number;
  @Input() isPaused!: boolean;
  @Input() isGameOver!: boolean;
  @Input() resultSum!: number | null;
  @Input() widthParent!: number;
  @Input() heightParent!: number;
  @Output() resultSumChange = new EventEmitter<number>();
  @ViewChild('Fish', { static: true }) fishHTML!: ElementRef;
  protected fishService = inject(CreateFishService);
  protected gameStatusService = inject(GameStatusService);

  private arrayCoordinates: any[] = [];
  private resume: number = 0;
  private animationTimer: any;
  private timeInterval: number = 0;
  private reloadTimeout: any;
  private fishParams: Fish = {} as Fish;

  ngAfterViewInit() {
    this.gameStatusService.getPause().subscribe((flag) => {
      this.isPaused = flag;
      if (!this.isPaused && !this.isGameOver && this.arrayCoordinates.length) {
        this.runSetTimeout(
          this.arrayCoordinates,
          this.resume,
          this.timeInterval
        ).then(() => {
          this.reload();
        });
      }
    });
    this.gameStatusService.getGameOver().subscribe((flag) => {
      this.isGameOver = flag;
      if (!this.isGameOver) {
        this.isPaused = false;

        this.reload();
      }
    });
    this.reload();
  }

  private reload() {
    // Получаем параметры рыбы
    this.fishParams = this.fishService.sizeFish();
    // Генерируем координаты
    this.arrayCoordinates = this.fishService.bezier(this.fishParams.width);

    // Очистка
    this.fishHTML.nativeElement.style.transition = '';
    this.fishHTML.nativeElement.style.left = `${this.arrayCoordinates?.[0].x}%`;
    this.resume = 0;
    clearTimeout(this.animationTimer);
    clearTimeout(this.reloadTimeout);

    this.reloadTimeout = setTimeout(() => {
      if (this.isGameOver) {
        return;
      }

      // Ставим интервал рендеринга
      this.timeInterval =
        (Math.floor(Math.random() * this.fishParams.time * 0.4 + 1) +
          this.fishParams.time) /
        this.arrayCoordinates.length;

      // Стилизуем
      this.fishHTML.nativeElement.style.transform =
        this.arrayCoordinates[0].x >
        this.arrayCoordinates[this.arrayCoordinates.length - 1].x
          ? 'scaleX(-1)'
          : 'scaleX(1)';
      this.fishHTML.nativeElement.style.width = `${this.fishParams.width}%`;
      this.fishHTML.nativeElement.style.color = this.fishParams.color;
      this.fishHTML.nativeElement.style.transition = `all ${
        this.timeInterval * 1.5
      }ms`;

      // Рендеринг
      this.runSetTimeout(this.arrayCoordinates, 0, this.timeInterval).then(
        () => {
          this.reload();
        }
      );
    }, 50);
  }

  private async runSetTimeout(
    coordinates: any[],
    index: number,
    delay: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = (i: number) => {
        if (this.isPaused || this.isGameOver) {
          return;
        }
        if (i < coordinates.length) {
          let { x, y } = coordinates[i];
          clearTimeout(this.animationTimer);
          this.animationTimer = setTimeout(() => {
            this.fishHTML.nativeElement.style.top = `${y}%`;
            this.fishHTML.nativeElement.style.left = `${x}%`;
            timeout(i + 1);
            this.resume = i;
          }, delay);
        } else {
          resolve();
        }
      };
      timeout(index);
    });
  }

  public clickOnFish() {
    if (this.isPaused || this.isGameOver) return;

    if (this.resultSum === null) {
      this.resultSum = 0;
    }
    this.resultSum += this.fishParams.points;
    this.resultSumChange.emit(this.resultSum);

    this.reload();
  }
}
