import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContactService } from '../../../service/contact.service';
import { DataGeneralService } from '../../../service/data-general.service';
import { AdministrativeUnit } from '../../../model/dictionary/administrative-unit';
import { forkJoin, EMPTY } from 'rxjs';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { AlertService } from '../../../service/alert.service';
import { ContactList } from '../../../model/contact/contact-list.model';
import { Dictionary } from '../../../model/dictionary/dictionary.model';
import { ContactDetail } from '../../../model/contact/contact-detail.model';
import { SessionService } from '../../../service/session.service';
import { OverviewForest } from '../../../model/overview-forest.model';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'contributing-information-form',
  templateUrl: './contributing-information-form.component.html',
  styleUrls: ['./contributing-information-form.component.scss']
})
export class ContributingInformationFormComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadImage') uploadImage;
  @Input('action') action: string;
  @Input('contactId') itemContactList: ContactList;
  @Input('forestPlotId') forestPlotId: number;
  @Input('detailsofTreeSpecies') detailsofTreeSpecies: OverviewForest;
  @Input('position') position: string;
  @Input('approved') approved: boolean;
  contributeForm: FormGroup;
  imageFiles;
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  formErrors = {
    contactTypeID: '',
    contactName: '',
    phone1: '',
  };
  invalidMessages: string[];
  isSubmitted: boolean;
  imageUrls = [];
  contactTypes: Dictionary[];
  contacDetailItem = new ContactDetail();
  showPopupViewImage = false;
  indexOfImage: number;
  imageUrlArray = [];
  isAlertPopup = false;
  isLimitImage = false;
  errLocalitys = false;
  apiErrorCode: string;
  constructor(
    private dialogRef: NbDialogRef<ContributingInformationFormComponent>,
    private fb: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private contactService: ContactService,
    private alertService: AlertService,
    private nbDialogService: NbDialogService
  ) { }

  get localitysFA(): FormArray { return this.contributeForm.get('localitys') as FormArray; }

  ngOnInit() {
    forkJoin(
      this.dataGeneralService.getProvinces(),
      this.dataGeneralService.getMasterData
    )
      .subscribe(([res1, res2]) => {
        this.stateProvinces = res1;
        this.contactTypes = res2.contactTypes;
      });
    if (this.action === 'create') {
      this.createForm();
      this.contributeForm.valueChanges
        .subscribe(data => this.onFormValueChanged());
    } else if (this.action === 'edit' || this.action === 'view') {
      this.contactService.detailContact(this.itemContactList.id).switchMap(response => {
        this.contacDetailItem = response;
        console.log('this.contacDetailItem', this.contacDetailItem);
        this.imageUrls = response.images;
        if (this.imageUrls.length === 3 || this.imageUrls.length > 3) {
          this.isLimitImage = true;
        }
        this.createForm();
        this.contributeForm.valueChanges
          .subscribe(data => this.onFormValueChanged());
        if (this.contacDetailItem && this.contacDetailItem.stateProvince && this.contacDetailItem.stateProvince.key) {
          return this.dataGeneralService.getDistricts(this.contacDetailItem.stateProvince.code).switchMap(dataDistricts => {
            this.districts = dataDistricts;
            if (this.contacDetailItem && this.contacDetailItem.district && this.contacDetailItem.district.key) {
              return this.dataGeneralService.getWards(this.contacDetailItem.district.code)
            } else {
              return EMPTY;
            }
          });
        } else {
          return EMPTY;
        }
      })
        .subscribe(dataCommunes => {
          this.communes = dataCommunes;
        });
    }
  }

  ngAfterViewInit() {
    if (document.getElementById('save') && document.getElementById('cancel')) {
      document.getElementById('save').tabIndex =  100 ;
      document.getElementById('cancel').tabIndex = 101;
    }
  }

  createForm() {
    this.contributeForm = this.fb.group({
      titleContribute: this.contacDetailItem.titleContribute,
      contactTypeID: [this.contacDetailItem.contactType && this.contacDetailItem.contactType.key, Validators.required],
      contactName: [this.contacDetailItem.contactName, Validators.required],
      acronymName: this.contacDetailItem.acronymName,
      userContact: this.contacDetailItem.userContact,
      phone1: [this.contacDetailItem.phone1, [Validators.required, CustomValidator.phoneNumber]],
      phone2: this.contacDetailItem.phone2,
      email: this.contacDetailItem.email,
      website: this.contacDetailItem.website,

      stateProvinceID: this.contacDetailItem.stateProvince && this.contacDetailItem.stateProvince.key,
      districtID: this.contacDetailItem.district && this.contacDetailItem.district.key,
      communeID: this.contacDetailItem.commune && this.contacDetailItem.commune.key,
      houseNumber: this.contacDetailItem.houseNumber,
      address: this.contacDetailItem.address,
      note: this.contacDetailItem.note,
      // images: '',

      localitys: this.fb.array([]),
    });
    this.addLocalityToFormStart();
  }

  uploadImageFuc(event) {
    const file = event.target.files;
    this.dataGeneralService.uploadImage(file[0]).subscribe(res => {
      this.imageUrls.push(res);
      this.uploadImage.nativeElement.value = null;
      setTimeout(_ => {
        if (this.imageUrls.length === 3 || this.imageUrls.length > 3) {
          this.isLimitImage = true;
        }
      })
    }, err => {
      this.alertService.error('Tải ảnh lên thất bại. Vui lòng thử lại!');
      this.imageUrls.forEach(x => {
        if (!x.guid) {
          this.imageUrls.splice(this.imageUrls.indexOf(x), 1);
        }
      });
    });
  }

  deleteImage(image) {
    if (image.guid) {
      this.dataGeneralService.deleteImage(image.guid).subscribe();
    }
    this.imageUrls.splice(this.imageUrls.indexOf(image), 1);
    setTimeout(_ => {
      if (this.imageUrls.length < 3) {
        this.isLimitImage = false;
      }
    })
  }

  onFocus(event) {
    event.target.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        event.target.click();
      }
    });
  }

  closePopup() {
    this.dialogRef.close(true);
  }

  getDistricts(provinceCode) {
    if (provinceCode === 'null') {
      this.contributeForm.get('stateProvinceID').patchValue(null);
    } else {
      const stateProvinceID = this.stateProvinces.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getDistricts(stateProvinceID.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.contributeForm.get('districtID').patchValue(null);
    this.communes = new Array<AdministrativeUnit>();
    this.contributeForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.contributeForm.get('districtID').patchValue(null);
    } else {
      const districtsID = this.districts.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getWards(districtsID.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.contributeForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  changeCommuneID() {
    this.patchValueAdress();
  }

  changeHouseNumber() {
    this.patchValueAdress();
  }

  patchValueAdress() {
    const communeIDValue = (this.communes || []).filter(item => item.key == this.contributeForm.get('communeID').value)[0];
    const districtIDValue = (this.districts || []).filter(item => item.key == this.contributeForm.get('districtID').value)[0];
    const stateProvinceIDValue = (this.stateProvinces || []).filter(item => item.key == this.contributeForm.get('stateProvinceID').value)[0];

    const houseNumber = this.contributeForm.get('houseNumber').value ? this.contributeForm.get('houseNumber').value : null;
    const communeID = communeIDValue ? communeIDValue.text : null;
    const districtID = districtIDValue ? districtIDValue.text : null;
    const stateProvinceID = stateProvinceIDValue ? stateProvinceIDValue.text : null;
    let address = null;
    if (houseNumber) {
      address = houseNumber;
    }
    if (communeID) {
      if (address) {
        address = address + ', ' + communeID;
      } else {
        address = communeID;
      }
    }
    if (districtID) {
      if (address) {
        address = address + ', ' + districtID;
      } else {
        address = districtID;
      }
    }
    if (stateProvinceID) {
      if (address) {
        address = address + ', ' + stateProvinceID;
      } else {
        address = stateProvinceID;
      }
    }
    this.contributeForm.get('address').patchValue(address);
  }

  submit() {
    this.isSubmitted = true;
    if (this.validateLocalitys()) {
      this.errLocalitys = false;
    } else {
      this.errLocalitys = true;
    }
    if (this.validateForm()) {
      if (this.validateLocalitys()) {
        const contributor = JSON.parse(window.localStorage.getItem('HAWA_USER')) && JSON.parse(window.localStorage.getItem('HAWA_USER')).organizationName ? JSON.parse(window.localStorage.getItem('HAWA_USER')).organizationName : '';
        if (this.action === 'create') {
          this.contactService.createContact(contributor, this.detailsofTreeSpecies, this.contributeForm.value, this.imageUrls).subscribe(response => {
            this.dialogRef.close(true);
            this.errLocalitys = false;
            this.alertService.success('Tạo mới đóng góp thành công.');
          }, err => {
            this.apiErrorCode = 'Tạo mới đóng góp thất bại';
          })
        } else if (this.action === 'edit' || this.action === 'view') {
          this.contactService.editContact(contributor, this.contacDetailItem.id, this.contributeForm.value, this.imageUrls, this.detailsofTreeSpecies).subscribe(response => {
            this.dialogRef.close(true);
            this.alertService.success('Chỉnh sửa đóng góp thành công.');
          }, err => {
            this.apiErrorCode = 'Chỉnh sửa đóng góp thất bại';
          })
        }
      }
    }
  }

  validateLocalitys(): boolean {
    if (this.contributeForm.get('localitys').value && (this.contributeForm.get('localitys').value || []).length !== 0) {
      return (this.contributeForm.get('localitys').value || []).every(item => {
        return item.stateProvinceID && item.stateProvinceID !== 'null';
        // && item.districtID && item.districtID !== 'null' && ( (item.communeID && item.communeID !== 'null') || ( (item.communes.length === 0) && (item.communeID === null) ) )
      })
    } else return false;
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.contributeForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      if (this.validateLocalitys()) {
        this.errLocalitys = false;
      } else {
        this.errLocalitys = true;
      }
      this.validateForm();
    }
  }

  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }

  closeView() {
    this.showPopupViewImage = false;
  }

  editStatusContact(status: string) {
    if (status === 'HuyBo') {
      this.nbDialogService.open(PopupComponent, {
        context: {
          showModel: {
            title: 'Hủy bỏ đóng góp',
            notices: [
              'Bạn có chắc muốn hủy bỏ đóng góp này?'
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
          this.contactService.changeStatusContact(this.itemContactList.id, status).subscribe(response => {
            this.contacDetailItem.status.key = 'HuyBo';
            this.isAlertPopup = true;
          });
        }
      })
    } else {
      this.contactService.changeStatusContact(this.itemContactList.id, status).subscribe(response => {
        switch (status) {
          case 'DaDuyet': {
            this.contacDetailItem.status.key = 'DaDuyet';
            this.isAlertPopup = true;
            break;
          }
          case 'DangXacMinh': {
            this.contacDetailItem.status.key = 'DangXacMinh';
            this.isAlertPopup = true;
            break;
          }
        }
      });
    }
  }

  addLocalityToFormStart() {
    const formArrayControl = this.contributeForm.get('localitys') as FormArray;
    if (this.contacDetailItem.locationInCharge && (this.contacDetailItem.locationInCharge || []).length !== 0) {
      if (this.detailsofTreeSpecies) {
        this.contacDetailItem.locationInCharge.forEach((item, index) => {
          if (item.commune.key === this.detailsofTreeSpecies.commune.key && index !== 0) {
            const temp = item;
            this.contacDetailItem.locationInCharge[index] = this.contacDetailItem.locationInCharge[0];
            this.contacDetailItem.locationInCharge[0] = temp;
          }
        })
      }

      this.contacDetailItem.locationInCharge.forEach(itemLocation => {
        const formArrayItem = this.fb.group({});
        formArrayItem.addControl('stateProvinceID', this.fb.control(itemLocation.stateProvince.key));
        formArrayItem.addControl('districtID', this.fb.control(itemLocation.district.key));
        formArrayItem.addControl('communeID', this.fb.control(itemLocation.commune.key));

        forkJoin(
          this.dataGeneralService.getDistricts(itemLocation.stateProvince.code),
          this.dataGeneralService.getWards(itemLocation.district.code)
        )
          .subscribe(([res1, res2]) => {
            formArrayItem.addControl('districts', this.fb.control(res1));
            formArrayItem.addControl('communes', this.fb.control(res2));
            formArrayControl.push(formArrayItem);
          })
      })
    } else {
      const formArrayItem = this.fb.group({});
      formArrayItem.addControl('stateProvinceID', this.fb.control(this.detailsofTreeSpecies.stateProvince.key));
      formArrayItem.addControl('districtID', this.fb.control(this.detailsofTreeSpecies.district.key));
      formArrayItem.addControl('communeID', this.fb.control(this.detailsofTreeSpecies.commune.key));

      forkJoin(
        this.dataGeneralService.getDistricts(this.detailsofTreeSpecies.stateProvince.code),
        this.dataGeneralService.getWards(this.detailsofTreeSpecies.district.code)
      )
        .subscribe(([res1, res2]) => {
          formArrayItem.addControl('districts', this.fb.control(res1));
          formArrayItem.addControl('communes', this.fb.control(res2));
          formArrayControl.push(formArrayItem);
        })
    }
  }

  addLocalityToForm() {
    const formArrayItem = this.fb.group({});
    const formArrayControl = this.contributeForm.get('localitys') as FormArray;
    formArrayItem.addControl('stateProvinceID', this.fb.control(null));
    formArrayItem.addControl('districtID', this.fb.control(null));
    formArrayItem.addControl('communeID', this.fb.control(null));
    formArrayItem.addControl('districts', this.fb.control([]));
    formArrayItem.addControl('communes', this.fb.control([]));
    formArrayControl.push(formArrayItem);
  }

  getDistrictsFA(provinceCode, indexFromArray: number) {
    if (provinceCode === 'null') {
      this.localitysFA.controls[indexFromArray].get('stateProvinceID').patchValue(null);
      this.localitysFA.controls[indexFromArray].get('districts').patchValue([]);
    } else {
      const stateProvinceID = this.stateProvinces.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getDistricts(stateProvinceID.code).subscribe(data => {
        this.localitysFA.controls[indexFromArray].get('districts').patchValue(data);
      });
    }
    this.localitysFA.controls[indexFromArray].get('districtID').patchValue(null);
    this.localitysFA.controls[indexFromArray].get('communeID').patchValue(null);
  }

  getWardsFA(provinceCode, indexFromArray: number) {
    if (provinceCode === 'null') {
      this.localitysFA.controls[indexFromArray].get('districtID').patchValue(null);
      this.localitysFA.controls[indexFromArray].get('communes').patchValue([]);
    } else {
      const districtsID = this.localitysFA.controls[indexFromArray].get('districts').value.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getWards(districtsID.code).subscribe(data => {
        this.localitysFA.controls[indexFromArray].get('communes').patchValue(data);
      });
    }
    this.localitysFA.controls[indexFromArray].get('communeID').patchValue(null);
  }

  deleteItemLocality(indexFromArray) {
    this.localitysFA.removeAt(indexFromArray);
  }

}
