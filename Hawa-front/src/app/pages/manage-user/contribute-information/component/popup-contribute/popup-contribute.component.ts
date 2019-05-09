import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailContribute, ImageItem } from '../../../../../shared/model/contribute-information/detail-contribute.model';
import { AdministrativeUnit } from '../../../../../shared/model/dictionary/administrative-unit';
import { DataGeneralService } from '../../../../../shared/service/data-general.service';

@Component({
  selector: 'popup-contribute',
  templateUrl: './popup-contribute.component.html',
  styleUrls: ['./popup-contribute.component.scss']
})
export class PopupContributeComponent implements OnInit {
  @Input() action: string;
  @Input() detailContribute: DetailContribute;
  attachmentImages: ImageItem[];
  status = {
    key: '',
    code: '',
    text: ''
  };
  formErrors = {
    target: '',
    host: '',
    phone: ''
  };
  isDisableDistrict = true;
  isDisableWard = true;
  listOfProvince: AdministrativeUnit[];
  listOfDistrict: AdministrativeUnit[];
  listOfWard: AdministrativeUnit[];
  detailContributeForm: FormGroup;
  constructor(
    private dialogRef: NbDialogRef<PopupContributeComponent>,
    private fb: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit() {
    this.attachmentImages = [...this.detailContribute.images];
    this.status = this.detailContribute.status;
    this.createForm();

  }
  getProvinces() {
    this.dataGeneralService.getProvinces().subscribe(result => {
      this.listOfProvince = result;
    });
  }
  getDistricts(provinceCode) {
    this.isDisableWard = true;
    this.detailContributeForm.get('ward').patchValue(null);
    this.detailContributeForm.get('ward').disable();
    if (provinceCode === 'null') {
      this.isDisableDistrict = true;
      this.detailContributeForm.get('district').patchValue(null);
      this.detailContributeForm.get('district').disable();
    }
    if (provinceCode !== 'null') {
      this.isDisableDistrict = false;
      this.detailContributeForm.get('district').enable();
      const codeProvince = this.listOfProvince.filter(item => item.key == provinceCode)[0].code
      this.dataGeneralService.getDistricts(codeProvince).subscribe(result => {
        this.listOfDistrict = result;
      });
    }
  }
  getWards(districtCode) {
    if (districtCode === 'null') {
      this.isDisableWard = true;
      this.detailContributeForm.get('ward').patchValue(null);
      this.detailContributeForm.get('ward').disable();
    }
    if (districtCode !== 'null') {
      this.isDisableWard = false;
      this.detailContributeForm.get('ward').enable();
      const codeDistrict = this.listOfDistrict.filter(item => item.key == districtCode)[0].code
      this.dataGeneralService.getWards(codeDistrict).subscribe(result => this.listOfWard = result)
    }
  }

  createForm() {
    this.detailContributeForm = this.fb.group({
      title: [this.detailContribute.title],
      target: [this.detailContribute.target, Validators.required],
      host: [this.detailContribute.host, Validators.required],
      acronymname: [this.detailContribute.acronymname],
      contact: [this.detailContribute.contact],
      firstPhone: [this.detailContribute.phone[0], Validators.required],
      secondPhone: [this.detailContribute.phone[1]],
      email: [this.detailContribute.email],
      website: this.detailContribute.website,
      province: this.detailContribute.province ? this.detailContribute.province.key : '',
      district: this.detailContribute.district ? this.detailContribute.district.key : '',
      ward: this.detailContribute.ward ? this.detailContribute.ward.key : '',
      houseNo: this.detailContribute.houseNo,
      address: this.detailContribute.address,
      note: this.detailContribute.note,
      images: this.attachmentImages
    })
    this.detailContributeForm.valueChanges.subscribe(_ => {

    })
    if (this.action == 'info' && this.detailContributeForm) {
      this.detailContributeForm.disable();
    }
  }

  uploadImage(event) {
    const images = event.target.files;
    this.dataGeneralService.uploadImage(images).subscribe(res => {
    })
  }
  deleteImage(url) {

  }
  viewFullScreenImage(listImage, indexImage?) {
    // this.showPopupViewImage = true;
    // this.imageUrlArray = [...listImage];
    // this.indexOfImage = indexImage;
  }


  closePopup(value) {
    if (!value) {
      this.dialogRef.close();
    }
    if (value) {
      this.dialogRef.close(value);
    }
  }

}
