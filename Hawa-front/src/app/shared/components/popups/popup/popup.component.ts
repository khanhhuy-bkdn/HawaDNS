import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ChangePassword } from '../../../model/change-password.model';
import { PopupGeneral } from '../../../model/dictionary/popup-general.model';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() showModel: PopupGeneral;
  submitForm: FormGroup;
  formErrors = {
    name: '',
    phone: '',
    identification: '',
    email: ''
  };
  constructor(
    private dialogRef: NbDialogRef<PopupComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }
  closePopup(value) {
    if (!value) {
      this.dialogRef.close();
    }
    if (value) {
      this.dialogRef.close(value);
    }
  }
}
