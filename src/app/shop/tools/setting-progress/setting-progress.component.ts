import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time'})
export class TimePipe implements PipeTransform {
    transform(value: number): string {
        return "00:00:" + ("0" + value).slice(-2);
    }
}

@Component({
  selector: 'app-setting-progress',
  templateUrl: './setting-progress.component.html',
  styleUrls: ['./setting-progress.component.css']
})
export class SettingProgressComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  buttonText = "Start progress";

  inProgress = false;
  seconds = 10;
  maxValue = 10;
  intervalId: number;

  onButtonClick() {
      if (this.inProgress) {
          this.buttonText = "Continue progress";
          clearInterval(this.intervalId);
      } else {
          this.buttonText = "Stop progress";

          if(this.seconds === 0) {
              this.seconds = 10;
          }
          // setInterval(() => this.timer(), 1000);
          //  = 
          // this.intervalId = setInterval(() => this.timer(), 1000);
          this.intervalId  = window.setInterval(() => this.timer(), 1000)
      }
      this.inProgress = !this.inProgress;
  }

  timer() {
    debugger;
      this.seconds--;
      if (this.seconds == 0) {
          this.buttonText = "Restart progress";
          this.inProgress = !this.inProgress;
          clearInterval(this.intervalId);
          return;
      }
  }

  format(value) {
      return 'Loading: ' + value * 100 + '%';
  }
}
