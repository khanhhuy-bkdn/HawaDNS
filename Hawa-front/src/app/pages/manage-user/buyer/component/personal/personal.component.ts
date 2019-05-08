import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelPopup } from '../../../../../shared/model/model-popup.model';
import ValidationHelper from '../../../../../helpers/validation.helper';
import { AdministrativeUnit } from '../../../../../shared/model/dictionary/administrative-unit';
import { DataGeneralService } from '../../../../../shared/service/data-general.service';
import { ManageBuyerService } from '../../../../../shared/service/manage-user-account/manage-buyer.service';
import { AlertService } from '../../../../../shared/service/alert.service';
import { UserBuyerModel } from '../../../../../shared/model/user-buyer/user-buyer.model';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ChangePasswordComponent } from '../../../../../shared/components/popups/change-password/change-password.component';
import { EMPTY } from 'rxjs';
import { PopupComponent } from '../../../../../shared/components/popups/popup/popup.component';
import CustomValidator from '../../../../../helpers/bys-validator.helper';

@Component({
  selector: 'personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  @ViewChild('changeProfilePicButton') changeProfilePicButton;
  @Input() action: string;
  @Input() infoUser: UserBuyerModel;
  @Input() typeOfUser: string;
  @Output() createdUser = new EventEmitter();
  profileAvatar: string;
  userStatuss: AdministrativeUnit[];
  isShowBasic = true;
  createUserForm: FormGroup;
  createUserModel: UserBuyerModel;
  isDisableDistrict = false;
  isDisableWard = false;
  listOfProvince: AdministrativeUnit[];
  listOfDistrict: AdministrativeUnit[];
  listOfWard: AdministrativeUnit[];
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    name: '',
    phone: '',
    email: ''
  };
  isChangePassword = false;
  isShowForm = false;
  popupModel = new ModelPopup();
  provinceValue;
  districtValue;
  isLoading: boolean = false;
  constructor(
    private dataGeneralService: DataGeneralService,
    private manageBuyerService: ManageBuyerService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit() {
    this.getMasterData();
    if (this.action === 'create') {
      this.getProvinces();
      this.profileAvatar = 'assets/images/avatar.svg';
      this.createUserModel = new UserBuyerModel();
      this.createForm();
      this.isShowForm = true;
    }
    if (this.action === 'info') {
      this.getProvinces();
      this.createUserModel = this.infoUser;
      this.profileAvatar = this.infoUser.avatar ? (this.infoUser.avatar.guid == '00000000-0000-0000-0000-000000000000' ? 'assets/images/avatar.svg' : this.infoUser.avatar.largeSizeUrl) : 'assets/images/avatar.svg';
      this.createForm();
      this.isShowForm = true;
    }
    if (this.action === 'edit') {
      this.createUserModel = this.infoUser;
      this.profileAvatar = this.infoUser.avatar ? (this.infoUser.avatar.guid == '00000000-0000-0000-0000-000000000000' ? 'assets/images/avatar.svg' : this.infoUser.avatar.largeSizeUrl) : 'assets/images/avatar.svg';
      this.mapDistrictWard();
    }
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
        } else {
          this.provinceValue = this.listOfProvince.find(item => item.key == this.createUserModel.stateProvince.key);
          return this.dataGeneralService.getDistricts(this.provinceValue.code)
        }
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
        if (this.createUserForm.get('fulladdress').value === '') {
          this.createUserForm.get('fulladdress').patchValue(
            this.patchFullAddress(this.provinceValue, this.districtValue, wardCode)
          )
        }
      });
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
      this.dataGeneralService.getDistricts(codeProvince).subscribe(result => {
        this.listOfDistrict = result;
      });
    }
    setTimeout(_ => {
      this.getFullAddress();
    });
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
    });
  }
  toggleForm(isShowBasic) {
    this.isShowBasic = !isShowBasic;
    setTimeout(() => {
      if (!this.isShowBasic) {
        this.checkedRating();
      }
    });
  }
  createForm() {
    this.createUserForm = this.fb.group({
      id: [this.createUserModel.id],
      name: [this.createUserModel.organizationName, Validators.required],
      phone: [this.createUserModel.phone, [Validators.required, CustomValidator.phoneNumber]],
      identification: [this.createUserModel.identityCard],
      province: [this.createUserModel.stateProvince ? this.createUserModel.stateProvince.key : null],
      district: [this.createUserModel.district ? this.createUserModel.district.key : null],
      ward: [this.createUserModel.commune ? this.createUserModel.commune.key : null],
      home: [this.createUserModel.houseNumber],
      fulladdress: [this.createUserModel.address],
      email: [this.createUserModel.email, [Validators.required, CustomValidator.email]],
      typeuser: [null],
      status: [this.createUserModel.status ? this.createUserModel.status.key : null],
      rating: [this.createUserModel.evaluate],
      profilePic: [this.createUserModel.avatar ? this.createUserModel.avatar.guid : null]
    });
    this.createUserForm.valueChanges.subscribe(_ => {
      this.onFormValueChanged();
      this.manageBuyerService.valueFormCreateBuyer = this.createUserForm.value;
    });
    setTimeout(() => {
      this.createUserForm.get('typeuser').patchValue('Personal');
      if (this.createUserForm.get('province').value === null) {
        this.createUserForm.get('district').patchValue(null);
        this.createUserForm.get('ward').patchValue(null);
        this.createUserForm.get('district').disable();
        this.createUserForm.get('ward').disable();
      }
      if (this.createUserForm.get('district').value === null) {
        this.createUserForm.get('ward').patchValue(null);
        this.createUserForm.get('ward').disable();
      }
    });
  }
  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
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
  patchFullAddress(province, district, ward) {
    const houseText = (this.createUserForm.get('home').value !== '') ? this.createUserForm.get('home').value : '';
    const wardText = (ward && houseText) ? (', ' + ward.text) : (ward ? ward.text : '');
    const districtText = (district && wardText) ? (', ' + district.text) : (district ? district.text : '');
    const provinceText = (province && districtText) ? (', ' + province.text) : (province ? province.text : '');
    return `${houseText}${wardText}${districtText}${provinceText}`
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

  toggleStatusOfUser(status) {
    this.createUserForm.get('status').patchValue(status);
  }

  submitForm(action) {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (action === 'create') {
        this.manageBuyerService.createUser(this.createUserForm.value).subscribe(result => {
          this.router.navigate([`pages/buyer/info/${result.id}`]);
          this.alertService.success('Tạo người dùng thành công');
        }, err => {
          const error = err._body ? JSON.parse(err._body) : null;
          if (error && error.errorMessage === 'Email đăng nhập trùng với user khác!') {
            this.formErrors.email = `${error.errorMessage}`;
          } else {
            this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.')
          }
        });
      }
      if (action === 'edit') {
        this.manageBuyerService.updateInfouser(this.createUserForm.value).subscribe(result => {
          this.router.navigate([`pages/buyer/info/${result.id}`]);
          this.alertService.success('Cập nhật thông tin người dùng thành công');
        }, err => {
          const error = err._body ? JSON.parse(err._body) : null;
          if (error && error.errorMessage === 'Email đăng nhập trùng với user khác!') {
            this.formErrors.email = `${error.errorMessage}`;
          } else {
            this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.')
          }
        });
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
  editForm() {
    this.action = 'edit';
    this.router.navigate([`/pages/buyer/edit/${this.infoUser.id}`]);
  }
  deleteUser() {
    this.dialogService.open(PopupComponent, {
      context: {
        showModel: {
          title: 'Vô hiệu hoá người dùng',
          notices: [
            'Bạn có chắc muốn vô hiệu hoá người dùng này?'
          ],
          actions: [
            {
              actionname: 'đồng ý',
              actionvalue: true,
              actiontype: ''
            },
            {
              actionname: 'hủy bỏ',
              actionvalue: false,
              actiontype: ''
            }
          ]
        }
      }
    }).onClose.subscribe(value => {
      if (!value) {
        return null;
      }
      if (value) {
        this.manageBuyerService.deleteUser(this.infoUser.id)
          .subscribe(_ => {
            this.alertService.success('Đã xóa người dùng.');
            this.router.navigate(['/pages/buyer']);
            this.manageBuyerService.directToBuyer(true);
          }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'))
      }
    })
  }
  changeProfilePic(event) {
    const imageFile = event.target.files;
    // Create
    this.dataGeneralService.uploadImage(imageFile[0]).subscribe(imageUrl => {
      this.createUserForm.get('profilePic').patchValue(imageUrl.guid);
      this.profileAvatar = imageUrl.largeSizeUrl;
    }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'))

  }
  changePassword() {
    this.dialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: 'đặt lại mật khẩu người dùng',
            notices: [
              'Bạn có chắc muốn đặt lại mật khẩu của người dùng này?'
            ],
            actions: [
              {
                actionname: 'đồng ý',
                actionvalue: true,
                actiontype: 'test'
              },
              {
                actionname: 'hủy',
                actionvalue: false,
                actiontype: 'test'
              }
            ]
          }
        }
      })
      .onClose.subscribe(isResetPassword => {
        if (isResetPassword) {
          this.isLoading = true;
          this.manageBuyerService.resetPasswordByAdmin(this.infoUser.id).subscribe(newPassword => {
            if (newPassword) {
              this.isLoading = false
              this.dialogService
                .open(PopupComponent, {
                  context: {
                    showModel: {
                      title: 'đặt lại mật khẩu người dùng',
                      notices: [
                        'Mật khẩu người dùng đã được đặt lại thành công.',
                        `Mật khẩu mới là: <strong>${newPassword}</strong>`
                      ],
                      actions: [
                        {
                          actionname: 'ok',
                          actionvalue: true,
                          actiontype: ''
                        }
                      ]
                    }
                  }
                })
            }
          }, err => {
            this.isLoading = false;
            this.alertService.error('Đã có lỗi, xin vui lòng thử lại.');
          })
        }
      })
  }

  redirectBack() {
    this.router.navigate(['/pages/buyer']);
    this.manageBuyerService.directToBuyer(true);
  }
}
