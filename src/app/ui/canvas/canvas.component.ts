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
import {
  BestResultWithPlayer,
  HttpService,
  Player,
  ResultArray,
} from '../../service/http.service';
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

  public bestResultWithPlayer: BestResultWithPlayer | null = null; // для отображения рейтинга

  ngOnInit() {
    this.http
      .resultArray({
        name: 'Mia',
        value: 720,
      })
      .subscribe((res: ResultArray) => {
        console.log('this.http.resultArray()', res);
      });

    this.width = this.container.nativeElement.clientWidth;
    this.height = this.container.nativeElement.clientHeight;

    this.http.getRating().subscribe((res: Player[]) => {
      this.bestResultWithPlayer = {
        array: res.slice(0, 10).map((el, index) => {
          return { player: el, position: index + 1 };
        }),
        player: null,
      };
    });
    this.http.getBestResultWithPlayer().subscribe((res) => {
      this.bestResultWithPlayer = res;
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
    this.bestResultWithPlayer = null;
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
            if (this.form.value?.username && this.resultSum) {
              this.http.uploadResult({
                name: this.form.value?.username,
                value: this.resultSum,
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
