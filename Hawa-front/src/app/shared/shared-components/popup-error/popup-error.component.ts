import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'popup-error',
  templateUrl: './popup-error.component.html',
  styleUrls: ['./popup-error.component.scss']
})
export class PopupErrorComponent implements OnInit {
  formattedErrors: string;

  @Input('errorCode') errorCode: string;
  @Input() change: number;
  constructor() { }

  ngOnChanges() {
    this.formattedErrors = this.errorCode;
  }


  ngOnInit() {
  }

  closeError() {
    this.formattedErrors = null;
  }

  
}
