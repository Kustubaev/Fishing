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
  @Input() resultSum!: number;
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
  private fishParams: Fish = {} as Fish;

  ngAfterViewInit() {
    this.gameStatusService.getPause().subscribe((flag) => {
      this.isPaused = flag;
      if (!this.isPaused && !this.isGameOver && this.arrayCoordinates.length) {
        console.log('Работает подписка на изменение паузы' + this.index);
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
      if (!this.isGameOver && this.arrayCoordinates.length) {
        console.log('Работает подписка на изменение игры' + this.index);
        this.isPaused = false;

        this.fishHTML.nativeElement.style.transition = '';
        this.fishHTML.nativeElement.style.left = `${
          -this.fishParams.width * 2
        }px`;
        clearTimeout(this.animationTimer);
        setTimeout(() => {
          this.reload();
        }, 50);
      }
    });
    this.reload();
    console.log('Работает в ngAfterViewInit после reload() ' + this.index);
  }

  private reload() {
    // Очистка
    this.resume = 0;
    clearTimeout(this.animationTimer);

    if (this.isGameOver) {
      return;
    }

    // Получаем параметры рыбы
    this.fishParams = this.fishService.sizeFish();

    // Генерируем координаты
    this.arrayCoordinates = this.fishService.bezier(
      -this.fishParams.width,
      this.widthParent,
      -this.fishParams.height,
      this.heightParent
    );

    // Ставим интервал рендеринга
    this.timeInterval =
      (Math.floor(Math.random() * this.fishParams.time * 0.4 + 1) +
        this.fishParams.time) /
      this.arrayCoordinates.length;

    // Стилизуем
    this.fishHTML.nativeElement.style.width = `${this.fishParams.width}px`;
    this.fishHTML.nativeElement.style.height = `${this.fishParams.height}px`;
    this.fishHTML.nativeElement.style.color = this.fishParams.color;
    this.fishHTML.nativeElement.style.transition = `all ${
      this.timeInterval * 1.5
    }ms`;

    // Рендеринг
    this.runSetTimeout(this.arrayCoordinates, 0, this.timeInterval).then(() => {
      this.reload();
    });
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
            this.fishHTML.nativeElement.style.top = `${y}px`;
            this.fishHTML.nativeElement.style.left = `${x}px`;
            timeout(i + 1);
            this.resume = i;
          }, delay);
        } else {
          this.fishHTML.nativeElement.style.transition = '';
          this.fishHTML.nativeElement.style.left = `${
            -this.fishParams.width * 2
          }px`;
          setTimeout(() => {
            resolve();
          }, 50);
        }
      };
      timeout(index);
    });
  }

  public clickOnFish() {
    if (this.isPaused || this.isGameOver) return;

    this.resultSum += this.fishParams.points;
    this.resultSumChange.emit(this.resultSum);

    this.fishHTML.nativeElement.style.transition = '';
    this.fishHTML.nativeElement.style.left = `${-this.fishParams.width * 2}px`;
    clearTimeout(this.animationTimer);
    setTimeout(() => {
      this.reload();
    }, 50);
  }
}
