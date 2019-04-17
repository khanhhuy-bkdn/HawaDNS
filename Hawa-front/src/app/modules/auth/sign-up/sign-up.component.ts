import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../shared/service/session.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.sessionService.currentSession) {
      this.router.navigate(['/pages/infor-search/list']);
    }
  }

}
