import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
// tslint:disable-next-line:max-line-length
import { PopupChooseMethodComponent } from '../../../modules/auth/sign-in/sign-in-general/popup-choose-method/popup-choose-method.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-infor-feedback',
  templateUrl: './infor-feedback.component.html',
  styleUrls: ['./infor-feedback.component.scss'],
})
export class InforFeedbackComponent implements OnInit {

  constructor(
    private ref: NbDialogRef<PopupChooseMethodComponent>,
  ) { }

  ngOnInit() {
  }

  closePopup() {
    this.ref.close();
  }
}
