import { Injectable, OnDestroy } from '@angular/core';
import { ReturnPage } from '../model/return-page/return-page.model';

@Injectable({
  providedIn: 'root'
})
export class SavePageToLoginRequiredService implements OnDestroy {
  // =========
  // Lưu giá trị filter và current page khi bắt buộc user đăng nhập trước khi xem thông tin
  returnPage = new ReturnPage();
  constructor() { }

  removeReturnPage() {
    this.returnPage = new ReturnPage();
  }

  ngOnDestroy() {
    this.removeReturnPage();
  }
  
}
