import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameStatusService } from '../../service/game-status.service';
import { HttpService, ResultArray } from '../../service/http.service';
import { FishComponent } from '../fish/fish.component';
import { RatingComponent } from '../rating/rating.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

const TIMER: number = 10 - 1; // -1 так как для проверки остается 1 секунда

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    FishComponent,
    SvgIconComponent,
    ReactiveFormsModule,
    RatingComponent,
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  host: {
    '(document:keyup.space)': 'pause($event)',
  },
})
export class CanvasComponent {
  @ViewChild('Container', { static: true }) container!: ElementRef;
  @ViewChild('Timer', { static: true }) timerHTML!: ElementRef;
  public http = inject(HttpService);
  public isPaused: boolean = false;
  public isGameOver: boolean = true;
  public width: number = 1380;
  public height: number = 830;
  public countdown = TIMER; // Установка времени игры
  public resultSum: number | null = null;
  private timer: any;
  protected gameStatusService = inject(GameStatusService);

  public resultArray: ResultArray | null = null; // для отображения рейтинга

  ngOnInit() {
    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;

    this.http.resultArray().subscribe((res: ResultArray) => {
      this.resultArray = res;
    });
  }

  public pause(event: any) {
    this.isPaused = !this.isPaused;
    this.gameStatusService.setPause(this.isPaused);
  }

  public playAgain() {
    this.countdown = -1;
    this.resultSum = null;
    clearInterval(this.timer);
    this.isPopup.set(true);
    this.isGameOver = true;
    this.gameStatusService.setGameOver(this.isGameOver);
  }

  public reload() {
    this.resultSum = null;
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
          if (this.form.value?.username.toLowerCase().trim() !== 'tester')
            this.countdown--;
          if (this.countdown < 0) {
            clearInterval(this.timer);
            this.isPopup.set(true);
            this.isGameOver = true;
            this.gameStatusService.setGameOver(this.isGameOver);
            this.resultArray = null;
            if (this.form.value?.username && this.resultSum) {
              let name = this.form.value?.username;
              name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
              this.http
                .resultArray({
                  name,
                  value: this.resultSum,
                })
                .subscribe((res: ResultArray) => {
                  this.resultArray = res;
                });
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(this.timer);
      this.isPopup.set(true);
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

  //form
  form: FormGroup = new FormGroup({
    username: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(20),
    ]),
  });
  isValid = signal<boolean>(false);
  isPopup = signal<boolean>(true); // Отвечает за окно ввода имени и позволяет начать игру

  public onSubmit() {
    this.form.controls['username'].markAsTouched();

    if (this.form.valid && this.form.value?.username) {
      this.isPopup.set(false);
      this.reload();
    }
  }
}
