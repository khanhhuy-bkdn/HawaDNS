import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
  @Input() message: any;
  constructor() { }

  ngOnInit() {
  }

}
