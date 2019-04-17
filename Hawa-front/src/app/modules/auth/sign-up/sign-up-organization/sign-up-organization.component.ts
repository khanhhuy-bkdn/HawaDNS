import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import CustomValidator from '../../../../helpers/bys-validator.helper';
import ValidationHelper from '../../../../helpers/validation.helper';
import { LogServiceService } from '../../../../shared/service/log-service.service';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { forkJoin } from 'rxjs';
import { AlertService } from '../../../../shared/service/alert.service';
import { NbDialogService } from '@nebular/theme';
import { NotifiSignedUpComponent } from '../notifi-signed-up/notifi-signed-up.component';
import { ComingSoonComponent } from '../../../../shared/components/popups/coming-soon/coming-soon.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sign-up-organization',
  templateUrl: './sign-up-organization.component.html',
  styleUrls: ['./sign-up-organization.component.scss']
})
export class SignUpOrganizationComponent implements OnInit {
  signUpOrganizationForm: FormGroup;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    organizationName: '',
    taxNumber: '',
    acronymName: '',
    representative: '',
    phone: '',
    website: ''
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
    private logServiceService: LogServiceService,
    private dataGeneralService: DataGeneralService,
    private alertService: AlertService,
    private nbDialogService: NbDialogService
  ) { }

  ngOnInit() {
    this.recaptChaKey = environment.recaptChaKey;
    forkJoin(
      this.dataGeneralService.getProvinces(),
      // this.dataGeneralService.getDistricts(),
      // this.dataGeneralService.getWards(),
    )
      .subscribe(([res1]) => {
        this.stateProvinces = res1;
      })
    this.createFormSignUpOrganization();
    this.signUpOrganizationForm.valueChanges
      .subscribe(data => this.onFormValueChanged());
  }

  createFormSignUpOrganization() {
    this.signUpOrganizationForm = this.fb.group({
      organizationName: ['', Validators.required],
      taxNumber: ['', Validators.required],
      stateProvinceID: [null],
      acronymName: ['', Validators.required],
      districtID: [null],
      representative: ['', Validators.required],
      communeID: [null],
      phone: ['', [Validators.required, CustomValidator.phoneNumber]],
      houseNumber: [''],
      fax: [''],
      address: [''],
      website: ['', [CustomValidator.website]],
      agreeTerms: [false]
    });
  }

  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.signUpOrganizationForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (this.signUpOrganizationForm.get('agreeTerms').value) {
        this.loading = true;
        this.logServiceService.accountRegister(this.signUpOrganizationForm.value, 'Organization').subscribe(reponse => {
          // this.alertService.success('Tạo mới thành công');
          this.loading = false;
          this.notification();
          // this.router.navigate(['/auth/sign-up/notification']);
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
    if (this.signUpOrganizationForm.get('stateProvinceID').value) {
      this.dataGeneralService.getDistricts(this.signUpOrganizationForm.get('stateProvinceID').value.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.signUpOrganizationForm.get('districtID').patchValue(null);
    this.communes = new Array<AdministrativeUnit>();
    this.signUpOrganizationForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  getWards() {
    if (this.signUpOrganizationForm.get('districtID').value) {
      this.dataGeneralService.getWards(this.signUpOrganizationForm.get('districtID').value.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.signUpOrganizationForm.get('communeID').patchValue(null);
    this.patchValueAdress();
  }

  changeCommuneID() {
    this.patchValueAdress();
  }

  changeHouseNumber() {
    this.patchValueAdress();
  }

  patchValueAdress() {
    const houseNumber = this.signUpOrganizationForm.get('houseNumber').value ? this.signUpOrganizationForm.get('houseNumber').value : null;
    const communeID = this.signUpOrganizationForm.get('communeID').value ? this.signUpOrganizationForm.get('communeID').value.text : null;
    const districtID = this.signUpOrganizationForm.get('districtID').value ? this.signUpOrganizationForm.get('districtID').value.text : null;
    const stateProvinceID = this.signUpOrganizationForm.get('stateProvinceID').value ? this.signUpOrganizationForm.get('stateProvinceID').value.text : null;
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
    this.signUpOrganizationForm.get('address').patchValue(address);
  }

  notification() {
    this.nbDialogService.open(NotifiSignedUpComponent, {
    }).onClose.subscribe(_ => {
      this.router.navigate(['/pages/infor-search/list'])
    });;
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
