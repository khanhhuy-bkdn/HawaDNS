import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import CustomValidator from '../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../helpers/validation.helper';
import { OrganizationBuyer } from '../../../shared/model/organization-buyer.model';
import { ModelPopup } from '../../../shared/model/model-popup.model';
import { ChangePasswordComponent } from '../../../shared/components/popups/change-password/change-password.component';
import { AlertService } from '../../../shared/service/alert.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AdministrativeUnit } from '../../../shared/model/dictionary/administrative-unit';
import { UserBuyerModel } from '../../../shared/model/user-buyer/user-buyer.model';
import { DataGeneralService } from '../../../shared/service/data-general.service';
import { ManageBuyerService } from '../../../shared/service/manage-user-account/manage-buyer.service';
import { EMPTY } from 'rxjs';
import { SessionService } from '../../../shared/service/session.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  profileAvatar: string;
  action: string;
  infoUser: UserBuyerModel;
  userStatuss: AdministrativeUnit[];
  isShowBasic = true;
  createUserForm: FormGroup;
  createUserModel = new UserBuyerModel();
  isDisableDistrict = false;
  isDisableWard = false;
  listOfProvince: AdministrativeUnit[];
  listOfDistrict: AdministrativeUnit[];
  listOfWard: AdministrativeUnit[];
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    name: '',
    taxnumber: '',
    acronym: '',
    representative: '',
    phone: '',
    website: '',
    email: ''
  };
  isChangePassword = false;
  popupModel = new ModelPopup();
  provinceValue;
  districtValue;
  previousAvatar;
  constructor(
    private fb: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private manageBuyerService: ManageBuyerService,
    private alertService: AlertService,
    private router: Router,
    private dialogService: NbDialogService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.action = 'info';
    this.createUserModel = JSON.parse(window.localStorage.getItem('HAWA_USER'));
    this.infoUser = JSON.parse(window.localStorage.getItem('HAWA_USER'));
    this.profileAvatar = this.infoUser.avatar ? (this.infoUser.avatar.guid == '00000000-0000-0000-0000-000000000000' ? 'assets/images/avatar.svg' : this.infoUser.avatar.largeSizeUrl) : 'assets/images/avatar.svg';
    this.previousAvatar = this.infoUser.avatar;
    this.getMasterData();
    this.mapDistrictWard();
  }
  mapDistrictWard() {
    this.dataGeneralService.getProvinces()
      .switchMap(result => {
        this.createForm();
        this.listOfProvince = result;
        if (!this.createUserModel.stateProvince) {
          this.isDisableDistrict = true;
          this.createUserForm.get('district').disable();
          this.isDisableWard = true;
          this.createUserForm.get('ward').disable();
          return EMPTY;
        }
        this.provinceValue = this.listOfProvince.find(item => item.key == this.createUserModel.stateProvince.key);
        return this.dataGeneralService.getDistricts(this.provinceValue.code)
      })
      .switchMap(districtResult => {
        this.listOfDistrict = districtResult;
        if (!this.createUserModel.district) {
          this.isDisableWard = true;
          this.createUserForm.get('ward').disable();
          return EMPTY;
        }
        this.districtValue = this.listOfDistrict.find(item => item.key == this.createUserModel.district.key);
        this.createUserForm.get('district').patchValue(this.districtValue.key);
        return this.dataGeneralService.getWards(this.districtValue.code)
      })
      .subscribe(wardResult => {
        this.listOfWard = wardResult;
        if (!this.createUserModel.commune) {
          return EMPTY;
        }
        const wardCode = this.listOfWard.find(item => item.key == this.createUserModel.commune.key);
        this.createUserForm.get('ward').patchValue(wardCode.key);
        if (!this.createUserForm.get('fulladdress').value) {
          this.createUserForm.get('fulladdress').patchValue(
            this.patchFullAddress(this.provinceValue, this.districtValue, wardCode)
          )
        }
      });
  }
  patchFullAddress(province, district, ward) {
    const provinceText = province ? (', ' + province.text) : '';
    const districtText = district ? (', ' + district.text) : '';
    const wardText = ward ? (', ' + ward.text) : '';
    const houseText = (this.createUserForm.get('home').value !== '') ? this.createUserForm.get('home').value : '';
    return `${houseText}${wardText}${districtText}${provinceText}`
  }
  getMasterData() {
    this.dataGeneralService.getMasterData.subscribe(masterData => {
      this.userStatuss = masterData.userStatues.map(item => ({
        key: item.key,
        code: item.code,
        text: item.text
      }));
    })
  }
  getProvinces() {
    this.dataGeneralService.getProvinces().subscribe(result => {
      this.listOfProvince = result;
    });
  }
  getDistricts(provinceCode) {
    this.isDisableWard = true;
    this.createUserForm.get('ward').patchValue(null);
    this.createUserForm.get('ward').disable();
    this.createUserForm.get('district').patchValue(null);
    if (provinceCode === 'null') {
      this.isDisableDistrict = true;
      this.createUserForm.get('district').disable();
    }
    if (provinceCode !== 'null') {
      this.isDisableDistrict = false;
      this.createUserForm.get('district').enable();
      const codeProvince = this.listOfProvince.filter(item => item.key == provinceCode)[0].code
      this.dataGeneralService.getDistricts(codeProvince).subscribe(result => this.listOfDistrict = result);
    }
    setTimeout(_ => {
      this.getFullAddress();
    })
  }
  getWards(districtCode) {
    this.createUserForm.get('ward').patchValue(null);
    if (districtCode === 'null') {
      this.isDisableWard = true;
      this.createUserForm.get('ward').disable();
    }
    if (districtCode !== 'null') {
      this.isDisableWard = false;
      this.createUserForm.get('ward').enable();
      const codeDistrict = this.listOfDistrict.filter(item => item.key == districtCode)[0].code
      this.dataGeneralService.getWards(codeDistrict).subscribe(result => this.listOfWard = result)
    }
    setTimeout(_ => {
      this.getFullAddress();
    })
  }
  toggleForm(isShowBasic) {
    this.isShowBasic = !isShowBasic;
    setTimeout(() => {
      if (!this.isShowBasic && this.createUserForm) {
        this.checkedRating();
      }
    });
  }
  checkedRating() {
    const checkboxs = document.getElementsByName('rating');
    const evaluate = this.createUserForm.get('rating').value;
    for (let i = 0; i < checkboxs.length; i++) {
      if ((<HTMLInputElement>checkboxs[i]).value == evaluate) {
        return (<HTMLInputElement>checkboxs[i]).checked = true;
      }
    }
  }
  createForm() {
    this.createUserForm = this.fb.group({
      id: [this.createUserModel.id],
      name: [this.createUserModel.organizationName, Validators.required],
      taxnumber: [this.createUserModel.taxNumber, Validators.required],
      acronym: [this.createUserModel.acronymName, Validators.required],
      representative: [this.createUserModel.representative, Validators.required],
      phone: [this.createUserModel.phone, [Validators.required, CustomValidator.phoneNumber]],
      fax: [this.createUserModel.fax],
      website: [this.createUserModel.website, [CustomValidator.website]],
      province: [this.createUserModel.stateProvince ? this.createUserModel.stateProvince.key : null],
      district: [this.createUserModel.district ? this.createUserModel.district.key : null],
      ward: [this.createUserModel.commune ? this.createUserModel.commune : null],
      home: [this.createUserModel.houseNumber],
      email: [this.createUserModel.email, [Validators.required, CustomValidator.email]],
      typeuser: [this.createUserModel.type ? this.createUserModel.type.key : null],
      status: [this.createUserModel.status ? this.createUserModel.status.key : null],
      rating: [this.createUserModel.evaluate],
      profilePic: [this.createUserModel.avatar ? this.createUserModel.avatar.guid : null],
      fulladdress: [this.createUserModel.address ? this.createUserModel.address : null],
    });
    this.createUserForm.valueChanges.subscribe(_ => {
      this.onFormValueChanged();
    });
  }
  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }
  submitForm(action) {
    const basicOk = this.formErrors.name == '' && this.formErrors.phone == '';
    const accountOk = this.formErrors.email == '';
    if (this.isSubmitted && this.isShowBasic && basicOk && !accountOk) {
      this.isShowBasic = false;
    }
    if (this.isSubmitted && !this.isShowBasic && accountOk && !basicOk) {
      this.isShowBasic = true;
    }
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (action === 'create') {
        this.manageBuyerService.createUser(this.createUserForm.value).subscribe(result => {
          this.alertService.success('Tạo người dùng thành công');
          // this.router.navigate([`pages/buyer/info/${result.id}`]);
        }, err => {
          this.alertService.error('Tạo người dùng không thành công.')
        });
      }
      if (action === 'edit') {
        this.manageBuyerService.updateInfouser(this.createUserForm.value).subscribe(result => {
          this.alertService.success('Cập nhật thông tin người dùng thành công');
          this.sessionService.userSubject.next(result);
          setTimeout(_ => {
            this.manageBuyerService.currentUserInfo().subscribe(_ => {
              this.ngOnInit();
            });
          });
          // this.router.navigate([`pages/buyer/info/${result.id}`]);
        }, err => this.alertService.error('Cập nhật thông tin người dùng không thành công.'));
      }
    }
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.createUserForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  changeProfilePic(event) {
    const imageFile = event.target.files;
    // Create
    this.dataGeneralService.uploadImage(imageFile[0]).subscribe(imageUrl => {
      this.createUserForm.get('profilePic').patchValue(imageUrl.guid);
      this.profileAvatar = imageUrl.largeSizeUrl;
    }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'))

    // Update
    // if (this.infoUser.id && this.infoUser.avatar) {
    //   this.manageBuyerService.changeProfileAvatar(this.infoUser.id, imageFile[0]).subscribe(imageUrl => {
    //     this.createUserForm.get('profilePic').patchValue(imageUrl.guid);
    //     this.profileAvatar = imageUrl.largeSizeUrl;
    //   }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'));
    // }
  }
  editForm() {
    this.action = 'edit';
  }
  cancel() {
    this.action = 'info';
    this.profileAvatar = this.previousAvatar ? this.previousAvatar.largeSizeUrl : 'assets/images/avatar.svg';
    if (this.previousAvatar) {
      this.createUserForm.get('profilePic').patchValue(this.previousAvatar.largeSizeUrl);
    }
    this.mapDistrictWard();
  }
  changePassword() {
    this.dialogService.open(ChangePasswordComponent, {
      context: {
        changePassWordModel: {
          oldpassword: '',
          newpassword: '',
          renewpassword: ''
        }
      }
    }).onClose.subscribe(check => {
      if (check == 'cancel') {
        return null;
      }
      if (check.success) {
        this.alertService.success('Mật khẩu đã được thay đổi.')
      }
      if (!check.success) {
        this.alertService.success('Đổi mật khẩu không thành công. Xin vui lòng thử lại.')
      }
    })
  }
  getFullAddress() {
    const home = (this.createUserForm.get('home').value) ? this.createUserForm.get('home').value : '';
    let ward = '';
    if (this.listOfWard && this.listOfWard.length > 0) {
      ward = (this.listOfWard.find(ward => ward.key == this.createUserForm.get('ward').value)) ?
        (home ? (', ' + this.listOfWard.find(ward => ward.key == this.createUserForm.get('ward').value).text) : this.listOfWard.find(ward => ward.key == this.createUserForm.get('ward').value).text)
        : '';
    }
    let district = '';
    if (this.listOfDistrict && this.listOfDistrict.length > 0) {
      district = (this.listOfDistrict.find(district => district.key == this.createUserForm.get('district').value)) ?
        ((home || ward) ? (', ' + this.listOfDistrict.find(district => district.key == this.createUserForm.get('district').value).text) : this.listOfDistrict.find(district => district.key == this.createUserForm.get('district').value).text)
        : '';
    }
    let province = '';
    if (this.listOfProvince && this.listOfProvince.length > 0) {
      province = (this.listOfProvince.find(province => province.key == this.createUserForm.get('province').value)) ?
        ((home || ward || district) ? (', ' + this.listOfProvince.find(province => province.key == this.createUserForm.get('province').value).text) : this.listOfProvince.find(province => province.key == this.createUserForm.get('province').value).text)
        : '';
    }

    const fulladdress = home + ward + district + province;
    setTimeout(() => {
      this.createUserForm.get('fulladdress').patchValue(fulladdress);
    });
  }
  getRateValue(ratevalue) {
    this.createUserForm.get('rating').patchValue(ratevalue)
  }

  routerBack() {
    this.router.navigate(['/pages/infor-search/list']);
  }
}
