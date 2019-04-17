import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'notifi-signed-up',
  templateUrl: './notifi-signed-up.component.html',
  styleUrls: ['./notifi-signed-up.component.scss']
})
export class NotifiSignedUpComponent implements OnInit {

  constructor(
    private ref: NbDialogRef<NotifiSignedUpComponent>,
  ) { }

  ngOnInit() {
  }

  closePopup() {
    this.ref.close();
  }
}
