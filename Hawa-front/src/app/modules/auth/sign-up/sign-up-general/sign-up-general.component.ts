import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { LogServiceService } from '../../../../shared/service/log-service.service';
import { SignUpGeneral } from '../../../../shared/model/sign-up-general.model';
import { UserService } from '../../../../shared/service/user.service';
import { AlertService } from '../../../../shared/service/alert.service';
import { ComingSoonComponent } from '../../../../shared/components/popups/coming-soon/coming-soon.component';
import { NbDialogService } from '@nebular/theme';
@Component({
  selector: 'app-sign-up-general',
  templateUrl: './sign-up-general.component.html',
  styleUrls: ['./sign-up-general.component.scss']
})
export class SignUpGeneralComponent implements OnInit, AfterViewInit {
  signUpGeneralForm: FormGroup;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    // username: '',
    email: '',
    password: '',
    rePassword: '',
  };
  currentYear = (new Date()).getFullYear();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private logServiceService: LogServiceService,
    private userService: UserService,
    private alertService: AlertService,
    private nbDialogService: NbDialogService
  ) { }

  ngOnInit() {
    this.createFormSignUpGeneral();
    this.signUpGeneralForm.valueChanges
      .subscribe(data => this.onFormValueChanged());
  }

  ngAfterViewInit() {
    document.getElementById('continueButton').tabIndex = 6;
  }

  createFormSignUpGeneral() {
    this.signUpGeneralForm = this.fb.group({
      // username: ['', [Validators.required, CustomValidator.loginName]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidator.password]],
      rePassword: ['', [Validators.required]],
      signUpRole: [true, [Validators.required]],
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.signUpGeneralForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (!this.matchPassword()) {
        this.formErrors.rePassword = 'Mật khẩu không khớp';
        return;
      }
      this.userService.checkexistemail(this.signUpGeneralForm.get('email').value).subscribe(reponse => {
        if (!reponse) {
          const signUpGeneral = new SignUpGeneral();
          signUpGeneral.email = this.signUpGeneralForm.get('email').value;
          signUpGeneral.password = this.signUpGeneralForm.get('password').value;
          signUpGeneral.rePassword = this.signUpGeneralForm.get('rePassword').value;
          this.logServiceService.signUpGeneral = signUpGeneral;
          if (this.signUpGeneralForm.get('signUpRole').value) {
            this.router.navigate(['/auth/sign-up/personal']);
          } else {
            this.router.navigate(['/auth/sign-up/organization']);
          }
        } else {
          this.alertService.error('Email này đã được sử dụng');
        }
      }, err => {
        this.alertService.error('Đã xảy ra lỗi');
      });
    }
  }

  matchPassword() {
    const newPassword = this.signUpGeneralForm.get('password').value;
    const confirmPassword = this.signUpGeneralForm.get('rePassword').value;
    return newPassword === confirmPassword;
  }

  signInComingSoon() {
    this.nbDialogService
      .open(ComingSoonComponent, {
        context: {
        }
      })
      .onClose.subscribe();
  }

  
}
