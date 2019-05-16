import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PopupChooseMethodComponent } from './popup-choose-method/popup-choose-method.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidationHelper from '../../../../helpers/validation.helper';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import { UserService } from '../../../../shared/service/user.service';
import { NbDialogService } from '@nebular/theme';
import { AlertService } from '../../../../shared/service/alert.service';
import { LogServiceService } from '../../../../shared/service/log-service.service';
import { SessionService } from '../../../../shared/service/session.service';
import { ComingSoonComponent } from '../../../../shared/components/popups/coming-soon/coming-soon.component';
import { SavePageToLoginRequiredService } from '../../../../shared/service/save-page-to-login-required.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sign-in-general',
  templateUrl: './sign-in-general.component.html',
  styleUrls: ['./sign-in-general.component.scss'],
})
export class SignInGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  dialog;
  authForm: FormGroup;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    username: '',
    password: '',
  };
  apiErrorCode: string;
  currentYear = (new Date()).getFullYear();
  isRemoveReturnPage = true;
  isSubAttemptAuth = true;
  constructor(
    private nbDialogService: NbDialogService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private logServiceService: LogServiceService,
    private sessionService: SessionService,
    private savePageToLoginRequiredService: SavePageToLoginRequiredService,
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, CustomValidator.loginName]],
      password: ['', [Validators.required, CustomValidator.password]],
    });

    this.authForm.valueChanges
      .subscribe(data => this.onFormValueChanged());
  }

  ngOnInit() {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        document.getElementById('continueButton').click();
      }
    });
  }

  ngOnDestroy() {
    if (this.isRemoveReturnPage) {
      this.savePageToLoginRequiredService.removeReturnPage();
    }
  }

  ngAfterViewInit() {
    document.getElementById('continueButton').tabIndex = 4;
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.authForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  chooseMethodVerifi() {
    // this.dialogService.open(PopupChooseMethodComponent, {
    // });
    this.logServiceService.verificationPhone = false;
    this.router.navigate([`/auth/sign-in/forgot-pass`]);
  }

  closePopuup() {
    this.dialog.close();
  }

  submitForm() {
    this.isSubmitted = true;
    this.apiErrorCode = '';
    if (this.validateForm()) {
      const credentials = this.authForm.value;
      this.userService.attemptAuth('loginweb', credentials.username, credentials.password)
        .subscribe(data => {
          // tslint:disable-next-line:max-line-length
          // if (this.sessionService.currentSession && this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
          //   this.router.navigate(['/pages/infor-search/list']);
          // } else {
          //   this.router.navigate(['/pages/infor-search/list']);
          // }'
          if (this.isSubAttemptAuth) {
            this.isSubAttemptAuth = false;
            if (this.savePageToLoginRequiredService.returnPage && this.savePageToLoginRequiredService.returnPage.routerBack) {
              this.isRemoveReturnPage = false;
              this.router.navigate([`${this.savePageToLoginRequiredService.returnPage.routerBack}`]);
            } else {
              this.router.navigate(['/pages/infor-search/list']);
            }
          }

        },
          err => {
            if (err._body && JSON.parse(err._body).errorCode == 'UserLoginIsNotActive') {
              return this.apiErrorCode = 'Tài khoản này đã bị khoá';
            } else if (err._body && JSON.parse(err._body).errorCode == 'NotValidatedEmail') {
              // return this.apiErrorCode = 'Tài khoản chưa được xác thực email. Vui lòng xác thực email đăng kí';
              return this.apiErrorCode = 'Tài khoản này chưa được xác nhận. Vui lòng kiểm tra email và xác nhận đăng ký';
            } else if (err._body && JSON.parse(err._body).errorCode == 'UserLoginInvalidUserNameOrPassword') {
              return this.apiErrorCode = 'Nhập sai email hoặc mật khẩu';
            } else {
              return this.apiErrorCode = 'Đã xảy ra lỗi';
            }
          });
    }
  }

  signInComingSoon() {
    this.nbDialogService
      .open(ComingSoonComponent, {
        context: {
        },
      })
      .onClose.subscribe();
  }
}
