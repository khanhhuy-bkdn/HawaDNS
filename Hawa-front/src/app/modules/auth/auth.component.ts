import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../shared/service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(
  ) { }
  
  ngOnInit() {
  }

}
