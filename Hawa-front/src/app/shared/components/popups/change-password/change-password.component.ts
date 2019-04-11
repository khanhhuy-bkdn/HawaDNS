import { Component, OnInit, Input } from '@angular/core';
import { ChangePassword } from '../../../model/change-password.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import ValidationHelper from '../../../../helpers/validation.helper';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import { DataGeneralService } from '../../../service/data-general.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Input() changePassWordModel: ChangePassword;
  changePassWordForm: FormGroup;
  formErrors = {
    oldpassword: '',
    newpassword: '',
    renewpassword: ''
  };
  invalidMessages: string[];
  isSubmitted: boolean;
  constructor(
    private dialogRef: NbDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.changePassWordForm = this.fb.group({
      oldpassword: [this.changePassWordModel.oldpassword, Validators.required],
      newpassword: [this.changePassWordModel.newpassword, [Validators.required, CustomValidator.password]],
      renewpassword: [this.changePassWordModel.renewpassword, Validators.required]
    });
    this.changePassWordForm.valueChanges.subscribe(_ => {
      if (this.isSubmitted) {
        this.validateForm();
      }
    });
  }
  closePopup(value) {
    if (!value) {
      this.dialogRef.close('cancel');
    }
    if (value) {
      this.isSubmitted = true;
      if (this.validateForm()) {
        if (!this.matchPassword()) {
          this.formErrors.renewpassword = 'Mật khẩu không khớp';
          return;
        }
        if (this.matchPassword) {
          this.dataGeneralService.changePassword(this.changePassWordForm.get('oldpassword').value, this.changePassWordForm.get('newpassword').value).subscribe(res => {
            this.dialogRef.close(res);
          }, err => {
            const error = JSON.parse(err._body);
            this.formErrors.oldpassword = `${error.errorMessage}`;
          })
        }
      }
    }
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.changePassWordForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  matchPassword() {
    const newPassword = this.changePassWordForm.get('newpassword').value;
    const confirmPassword = this.changePassWordForm.get('renewpassword').value;
    return newPassword === confirmPassword;
  }
  showPassword(id) {
    const x = <HTMLInputElement>document.getElementById(id);
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }


}
