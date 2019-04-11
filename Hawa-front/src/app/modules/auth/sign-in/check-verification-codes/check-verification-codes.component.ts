import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import ValidationHelper from '../../../../helpers/validation.helper';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/service/user.service';
@Component({
  selector: 'app-check-verification-codes',
  templateUrl: './check-verification-codes.component.html',
  styleUrls: ['./check-verification-codes.component.scss']
})
export class CheckVerificationCodesComponent implements OnInit, OnDestroy {
  isSubmitted: boolean;
  checkVerificationForm: FormGroup;
  invalidMessages: string[];
  formErrors = {
    code: ''
  };
  apiErrorCode: string;
  valuePhoneOrEmail: string;
  queryParamsSubsription: Subscription;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.queryParamsSubsription = this.activatedRoute.queryParams.subscribe(data => {
      this.valuePhoneOrEmail = data.valuePhoneOrEmail;
    });
    this.createFormForgotPass();
    this.checkVerificationForm.valueChanges.subscribe(data => this.onFormValueChanged());
  }

  ngOnDestroy() {
    if (this.queryParamsSubsription) {
      this.queryParamsSubsription.unsubscribe();
    }
  }

  createFormForgotPass() {
    this.checkVerificationForm = this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.checkVerificationForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submit() {
    this.isSubmitted = true;
    this.apiErrorCode = '';
    const form = this.checkVerificationForm.value;
    if (this.validateForm()) {
      this.userService
        .validateActiveCode(form.code, this.valuePhoneOrEmail)
        .subscribe(data => {
          if (data) {
            // this.userService.deleteEmail();
            this.router.navigate(['/auth/sign-in/change-pass'], {
              queryParams: {
                // activeCode: code
                valuePhoneOrEmail: this.valuePhoneOrEmail,
                token: data,
              }
            });
          } else {
            this.apiErrorCode = 'Mã xác nhận không đúng.';
          }
        }, err => {
          this.apiErrorCode = 'Mã xác nhận chưa đúng. Vui lòng kiểm tra lại email đã nhận!';
        });
    }
  }

  back() {
    this.router.navigate(['/auth/sign-in/forgot-pass']);
  }

  sendCodeAgain() {
    this.userService
      .getActiveCode(this.valuePhoneOrEmail)
      .subscribe(
        data => {
        },
        err => {
          // this.apiErrorCode = 'Địa chỉ email không tồn tại trong hệ thống !';
        });
  }
}
