import { Component, OnInit } from '@angular/core';
import { Subscription, EMPTY } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LookForInfoService } from '../../../../shared/service/look-for-info.service';
import { ActorModel } from '../../../../shared/model/actor/actor.model';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { AlertService } from '../../../../shared/service/alert.service';
import { ActorType } from '../../../../shared/model/dictionary/actor-type.model';
import ValidationHelper from '../../../../helpers/validation.helper';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import { isFulfilled } from 'q';

@Component({
  selector: 'evaluate-actor-form-create',
  templateUrl: './evaluate-actor-form-create.component.html',
  styleUrls: ['./evaluate-actor-form-create.component.scss']
})
export class EvaluateActorFormCreateComponent implements OnInit {
  formErrors = {
    name: '',
    phone: '',
    email: '',
    website: ''
  };
  queryParamsSubscription: Subscription;
  actorId: number;
  actorForm: FormGroup;
  actor = new ActorModel();
  listOfProvince: AdministrativeUnit[];
  listOfDistrict: AdministrativeUnit[];
  listOfWard: AdministrativeUnit[];
  actorTypes: ActorType[];
  invalidMessages: string[];
  isSubmit = false;
  forestPlotId: number;
  loading: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private lookForInfoService: LookForInfoService,
    private dataGeneralService: DataGeneralService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.createForm();
    this.loading = false;
    this.mapDistrictCommune();
    this.dataGeneralService.getMasterData.subscribe(result => {
      this.actorTypes = result.actorTypes;
    });
  }

  createForm() {
    this.actorForm = this.fb.group({
      name: [this.actor.name, CustomValidator.required],
      email: [this.actor.email, CustomValidator.email],
      phone: [this.actor.phone, [CustomValidator.required, CustomValidator.phoneNumber]],
      website: [this.actor.website, CustomValidator.website],
      avatar: this.actor.avatar,
      type: this.actor.type,
      identityCard: this.actor.identityCard,
      acronymName: this.actor.acronymName,
      representative: this.actor.representative,
      fax: this.actor.fax,
      address: this.actor.address,
      houseNumber: this.actor.houseNumber,
      stateProvince: this.actor.stateProvince && this.actor.stateProvince,
      district: this.actor.district,
      commune: this.actor.commune,
      status: this.actor.status,
      // Các field không sửa
      averageRating: this.actor.averageRating,
      roles: this.actor.roles,
      contactName: this.actor.contactName,
      contactPhone: [this.actor.contactPhone, CustomValidator.phoneNumber],
      note: this.actor.note,
    });
    this.actorForm.valueChanges.subscribe(_ => {
      this.onFormValueChanged();
    });
  }

  mapDistrictCommune() {
    this.dataGeneralService.getProvinces()
      .switchMap(result => {
        this.listOfProvince = result;
        if (!this.actor.stateProvince) {
          return EMPTY;
        }
        return this.dataGeneralService.getDistricts(this.actor.stateProvince && this.actor.stateProvince.code)
      })
      .switchMap(districtResult => {
        this.listOfDistrict = districtResult;
        if (!this.actor.district) {
          return EMPTY;
        }
        return this.dataGeneralService.getWards(this.actor.district && this.actor.district.code)
      })
      .subscribe(wardResult => {
        this.listOfWard = wardResult;
        if (!this.actor.commune) {
          return EMPTY;
        }
      });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.key === c2.key : c1 === c2;
  }

  compareTypeFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  getDistricts() {
    if (this.actorForm.value && this.actorForm.value.stateProvince) {
      this.dataGeneralService.getDistricts(this.actorForm.value.stateProvince.code).subscribe(districtResult => {
        this.listOfDistrict = districtResult;
      });
      this.actorForm.get('district').patchValue(null);
      this.actorForm.get('commune').patchValue(null);
    } else {
      this.actorForm.get('district').patchValue(null);
      this.actorForm.get('commune').patchValue(null);
    }
    this.getFullAddress();
  }

  getCommune() {
    if (this.actorForm.value && this.actorForm.value.district) {
      this.dataGeneralService.getWards(this.actorForm.value.district.code).subscribe(wardResult => {
        this.listOfWard = wardResult;
      });
      this.actorForm.get('commune').patchValue(null);
    } else {
      this.actorForm.get('commune').patchValue(null);
    }
    this.getFullAddress();
  }

  getFullAddress() {
    const home = this.actorForm.value && this.actorForm.value.houseNumber ? this.actorForm.value.houseNumber : '';
    let ward = '';
    if (this.actorForm.value && this.actorForm.value.commune) {
      ward = this.actorForm.value.commune.text;
    }
    let district = '';
    if (this.actorForm.value && this.actorForm.value.district) {
      district = this.actorForm.value.district.text;
    }
    let province = '';
    if (this.actorForm.value && this.actorForm.value.stateProvince) {
      province = this.actorForm.value.stateProvince.text;
    }
    let fulladdress = home;
    if (ward) {
      fulladdress = fulladdress !== '' ? fulladdress + ', ' + ward : ward;
    }
    if (district) {
      fulladdress = fulladdress !== '' ? fulladdress + ', ' + district : district;
    }
    if (province) {
      fulladdress = fulladdress !== '' ? fulladdress + ', ' + province : province;
    }
    setTimeout(() => {
      this.actorForm.get('address').patchValue(fulladdress);
    });
  }

  changeProfilePic(event) {
    const imageFile = event.target.files;
    this.dataGeneralService.uploadImage(imageFile[0]).subscribe(imageUrl => {
      this.actorForm.get('avatar').patchValue(imageUrl);
    }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'))
  }

  onFormValueChanged() {
    if (this.isSubmit) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.actorForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmit = true;
    if (this.validateForm()) {
      this.lookForInfoService.createActor(this.actorForm.value).subscribe(response => {
        this.alertService.success('Tạo mới thông tin chủ rừng thành công.');
        this.router.navigate([`/pages/evaluate-actor/list-actor`]);
      }, err => {
        this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
      });
    }
  }
}
