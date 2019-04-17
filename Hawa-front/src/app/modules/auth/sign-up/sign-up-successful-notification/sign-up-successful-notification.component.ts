import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/service/user.service';
import { AlertService } from '../../../../shared/service/alert.service';

@Component({
  selector: 'app-sign-up-successful-notification',
  templateUrl: './sign-up-successful-notification.component.html',
  styleUrls: ['./sign-up-successful-notification.component.scss']
})
export class SignUpSuccessfulNotificationComponent implements OnInit {
  queryParamsSubsription: Subscription;
  email: string;
  activeToken: string;
  isShow: string;
  loading: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.queryParamsSubsription = this.activatedRoute.queryParams.subscribe(data => {
      this.email = data.email;
      const activeTokenReplace = decodeURIComponent(data.activeToken).replace(/\s/gm, '+');
      this.userService.accountVerify(data.email, activeTokenReplace).subscribe(response => {
        this.loading = false;
        this.isShow = 'success';
      },
        err => {
          if (err._body && (JSON.parse(err._body).errorCode === 'TokenExpireException' || JSON.parse(err._body).errorCode === 'VerifyAccountFailedException' ) ) {
            this.isShow = 'TokenExpireException';
            this.loading = false;
          } else if (err._body && JSON.parse(err._body).errorCode === 'AccountAlreadyVerifyException') {
            // if (JSON.parse(err._body).errorMessage === 'Tài khoản đã được xác thực!!!') {
              this.isShow = 'AccountAlreadyVerifyException';
              this.loading = false;
            // }
          } else {
            this.loading = false;
            this.router.navigate(['/not-found/404']);
          }
        })
    });
  }
  resendEmail() {
    this.userService.resendEmail(this.email).subscribe(res => {
      this.alertService.success('Yêu cầu gửi lại email xác nhận thành công');
    })
  }
}
