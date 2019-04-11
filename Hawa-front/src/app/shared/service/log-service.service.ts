import { Injectable } from '@angular/core';
import { SignUpGeneral } from '../model/sign-up-general.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SignUp } from '../model/sign-up.model';

@Injectable({
  providedIn: 'root'
})
export class LogServiceService {
  verificationPhone: boolean;
  signUpGeneral: SignUpGeneral;
  constructor(
    private apiService: ApiService,
  ) { }

  // Đăng ký tài khoản
  accountRegister(formValue: any, type: string): Observable<any> {
    const url = `account/register`;
    let request = new SignUp();
    request = {
      userName: formValue.userName,
      password: this.signUpGeneral.password,
      email: this.signUpGeneral.email,
      type: type,
      organizationName: formValue.organizationName,
      taxNumber: formValue.taxNumber,
      acronymName: formValue.acronymName,
      representative: formValue.representative,
      phone: formValue.phone,
      fax: formValue.fax,
      website: formValue.website,
      stateProvinceID: formValue.stateProvinceID ? +formValue.stateProvinceID.key : null,
      districtID: formValue.districtID ? +formValue.districtID.key : null,
      communeID: formValue.communeID ? +formValue.communeID.key : null,
      houseNumber: formValue.houseNumber,
      address: formValue.address,
      identityCard: formValue.identityCard,
    }
    return this.apiService.post(url, request).map(response => {
      return response;
    });
  }
}
