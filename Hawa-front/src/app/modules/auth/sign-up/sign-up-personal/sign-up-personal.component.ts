import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../../shared/service/alert.service';
import { LogServiceService } from '../../../../shared/service/log-service.service';
import { NbDialogService } from '@nebular/theme';
import { NotifiSignedUpComponent } from '../notifi-signed-up/notifi-signed-up.component';
import { ComingSoonComponent } from '../../../../shared/components/popups/coming-soon/coming-soon.component';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-sign-up-personal',
  templateUrl: './sign-up-personal.component.html',
  styleUrls: ['./sign-up-personal.component.scss']
})
export class SignUpPersonalComponent implements OnInit {
  signUpPersonalForm: FormGroup;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    organizationName: '',
    phone: '',
    // identityCard: '',
  };
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  loading = false;
  captchaResponse: string;
  recaptChaKey: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataGeneralService: DataGeneralService,
    private alertService: AlertService,
    private logServiceService: LogServiceService,
    private nbDialogService: NbDialogService
  ) { }

  ngOnInit() {
    this.recaptChaKey = environment.recaptChaKey;
    forkJoin(
      this.dataGeneralService.getProvinces(),
    )
      .subscribe(([res1]) => {
        this.stateProvinces = res1;
      })
    this.createFormSignUpPersonal();
    this.signUpPersonalForm.valueChanges
      .subscribe(data => this.onFormValueChanged());
  }

  createFormSignUpPersonal() {
    this.signUpPersonalForm = this.fb.group({
      organizationName: ['', Validators.required],
      phone: ['', [Validators.required, CustomValidator.phoneNumber]],
      identityCard: [''],
      stateProvinceID: [null],
      districtID: [null],
      communeID: [null],
      houseNumber: [''],
      address: [''],
      agreeTerms: [false]
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.signUpPersonalForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (this.signUpPersonalForm.get('agreeTerms').value) {
        this.loading = true;
        this.logServiceService.accountRegister(this.signUpPersonalForm.value, 'Personal').subscribe(reponse => {
          // this.alertService.success('Tạo mới thành công');
          this.loading = false;
          this.notification();
          // this.router.navigate(['/log/sign-up/notification']);
        }, err => {
          this.loading = false;
          this.alertService.error('Đã xảy ra lỗi!');
        })
      } else {
        this.alertService.error('Bạn chưa đồng ý với điều khoản của chúng tôi');
      }
    }
  }

  getDistricts() {
    if (this.signUpPersonalForm.get('stateProvinceID').value) {
      this.dataGeneralService.getDistricts(this.signUpPersonalForm.get('stateProvinceID').value.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.signUpPersonalForm.get('districtID').patchValue(null);
    this.communes = new Array<AdministrativeUnit>();
    this.signUpPersonalForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  getWards() {
    if (this.signUpPersonalForm.get('districtID').value) {
      this.dataGeneralService.getWards(this.signUpPersonalForm.get('districtID').value.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.signUpPersonalForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  changeCommuneID() {
    this.patchValueAdress();
  }

  changeHouseNumber() {
    this.patchValueAdress();
  }

  patchValueAdress() {
    const houseNumber = this.signUpPersonalForm.get('houseNumber').value ? this.signUpPersonalForm.get('houseNumber').value : null;
    const communeID = this.signUpPersonalForm.get('communeID').value ? this.signUpPersonalForm.get('communeID').value.text : null;
    const districtID = this.signUpPersonalForm.get('districtID').value ? this.signUpPersonalForm.get('districtID').value.text : null;
    const stateProvinceID = this.signUpPersonalForm.get('stateProvinceID').value ? this.signUpPersonalForm.get('stateProvinceID').value.text : null;
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
    this.signUpPersonalForm.get('address').patchValue(address);
  }

  notification() {
    this.nbDialogService.open(NotifiSignedUpComponent, {
    }).onClose.subscribe(_ => {
      this.router.navigate(['/pages/infor-search/list'])
    });
  }

  signInComingSoon() {
    this.nbDialogService
      .open(ComingSoonComponent, {
        context: {
        }
      })
      .onClose.subscribe();
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }
}
