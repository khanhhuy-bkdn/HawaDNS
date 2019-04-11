import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'rate-star',
  templateUrl: './rate-star.component.html',
  styleUrls: ['./rate-star.component.scss']
})
export class RateStarComponent implements OnInit, OnChanges {
  @Input() disabledRate: boolean;
  @Input() name: string;
  @Input() score: number;
  @Input() step: any; // 0.5 or 1
  @Input() color: string;
  @Input() default: number;
  @Output() newvalue: EventEmitter<any> = new EventEmitter();
  childState: string;
  value: number;
  lengthOfRateBar;
  @Input() minor: number;
  @Input() change: number;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.change) {
      this.value = this.change;
    }
    if (this.minor) {
      this.value = this.default;
    }
  }

  ngOnInit() {
    this.value = this.default;
    this.newvalue.emit(this.default);
    this.lengthOfRateBar = Array.from(Array(this.score / this.step).keys()).reverse();
  }

  choose(event) {
    this.newvalue.emit(event);
  }


}
