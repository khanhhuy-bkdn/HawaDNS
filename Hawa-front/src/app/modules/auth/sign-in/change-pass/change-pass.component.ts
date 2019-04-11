import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { UserService } from '../../../../shared/service/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../shared/service/alert.service';
@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {
  changePassForm: FormGroup;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    password: '',
    rePassword: '',
  };
  valuePhoneOrEmail: string;
  token: string;
  queryParamsSubsription: Subscription;
  apiErrorCode: string;
  loading = false;
  statusCallAPI: string;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.queryParamsSubsription = this.activatedRoute.queryParams.subscribe(data => {
      this.valuePhoneOrEmail = data.email;
      const activeTokenReplace = decodeURIComponent(data.activeToken).replace(/\s/gm, '+');
      this.token = activeTokenReplace;
    });
    this.userService
      .validateActiveCode(this.valuePhoneOrEmail, this.token)
      .subscribe(data => {
        this.loading = false;
        this.statusCallAPI = 'success';
      }
        , err => {
          this.loading = false;
          if (err._body && JSON.parse(err._body).errorCode === 'TokenExpireException') {
            this.statusCallAPI = 'tokenExpireException';
          } else {
            this.router.navigate(['/not-found/404']);
          }
        });
    this.createChangePassForm();
    this.changePassForm.valueChanges.subscribe(data => this.onFormValueChanged());
  }

  createChangePassForm() {
    this.changePassForm = this.fb.group({
      password: ['', [Validators.required, CustomValidator.password]],
      rePassword: ['', [Validators.required]]
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.changePassForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  matchPassword() {
    const newPassword = this.changePassForm.get('password').value;
    const confirmPassword = this.changePassForm.get('rePassword').value;
    return newPassword === confirmPassword;
  }

  submitForm() {
    this.isSubmitted = true;
    this.apiErrorCode = '';
    if (this.validateForm()) {
      if (!this.matchPassword()) {
        // this.formErrors.rePassword = 'Mật khẩu không khớp';
        this.apiErrorCode = 'Mật khẩu không khớp';
        return;
      }
      // Sign-in
      const newPassword = this.changePassForm.value.password;
      this.userService
        .resetPassword(this.valuePhoneOrEmail, this.token, newPassword)
        .subscribe(data => {
          // this.alertService.success('Đặt lại mật khẩu thành công!', true);
          this.router.navigate(['/auth/sign-in/notifi-success-change-pass']);
        }, err => {
          this.apiErrorCode = 'Đã có lỗi xảy ra, vui lòng thử lại';
        });
    }
  }

  resendEmail() {
    this.userService
      .getActiveCode(this.valuePhoneOrEmail)
      .subscribe(response => {
        this.alertService.success('Yêu cầu gửi lại đường dẫn đặt mật khẩu thành công');
      }, err => {
        this.alertService.error('Đã xảy ra lỗi. Yêu cầu gửi lại đường dẫn đặt mật khẩu không thành công');
      })
  }
}

