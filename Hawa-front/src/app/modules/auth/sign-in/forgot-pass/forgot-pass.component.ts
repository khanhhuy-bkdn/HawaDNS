import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { LogServiceService } from '../../../../shared/service/log-service.service';
import { UserService } from '../../../../shared/service/user.service';
@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  verificationPhone: boolean;
  isSubmitted: boolean;
  forgotPassForm: FormGroup;
  invalidMessages: string[];
  formErrors = {
    valuePhoneOrEmail: '',
  };
  apiErrorCode: string;
  callApiSuccess = false;
  constructor(
    private router: Router,
    private logServiceService: LogServiceService,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.verificationPhone = this.logServiceService.verificationPhone;
    this.createFormForgotPass();
    this.forgotPassForm.valueChanges
      .subscribe(data => this.onFormValueChanged());
  }

  createFormForgotPass() {
    this.forgotPassForm = this.fb.group({
      valuePhoneOrEmail: ['', [Validators.required, this.verificationPhone ? CustomValidator.phoneNumber : Validators.email]],
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.forgotPassForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submit() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const form = this.forgotPassForm.value;
      this.userService
        .getActiveCode(form.valuePhoneOrEmail)
        .subscribe(
          data => {
            // this.router.navigate([`/auth/sign-in/verification`], { queryParams: { valuePhoneOrEmail: form.valuePhoneOrEmail } });
            this.callApiSuccess = true;
            this.apiErrorCode = '';
          },
          err => {
            if (err._body && JSON.parse(err._body).errorCode == 'BusinessException') {
              this.apiErrorCode = JSON.parse(err._body).errorMessage;
            } else {
              this.apiErrorCode = 'Đã xảy ra lỗi. Vui lòng thử lại.';
            }

          });
    }
  }

  back() {
    this.router.navigate([`/auth/sign-in/general`]);
  }

}
