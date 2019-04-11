import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LookForInfoService } from '../../../service/look-for-info.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdministrativeUnit } from '../../../model/dictionary/administrative-unit';
import { DataGeneralService } from '../../../service/data-general.service';
import { forkJoin } from 'rxjs';
import { ContactService } from '../../../service/contact.service';
import { ContactList } from '../../../model/contact/contact-list.model';
import { ContactDetail } from '../../../model/contact/contact-detail.model';
import { OverviewForest } from '../../../model/overview-forest.model';

@Component({
  selector: 'contributing-information-detail',
  templateUrl: './contributing-information-detail.component.html',
  styleUrls: ['./contributing-information-detail.component.scss']
})
export class ContributingInformationDetailComponent implements OnInit {
  @ViewChild('uploadImage') uploadImage;
  @Input('action') action: string;
  @Input('contactId') itemContactList: ContactList;
  @Input('position') position: string;
  @Input('detailsofTreeSpecies') detailsofTreeSpecies: OverviewForest;
  form: FormGroup;
  imageFiles;
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  contacDetailItem: ContactDetail;
  imageUrls = [];
  constructor(
    private dialogRef: NbDialogRef<ContributingInformationDetailComponent>,
    private fb: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    forkJoin(
      this.dataGeneralService.getProvinces(),
      this.contactService.detailContact(this.itemContactList.id)
    )
      .subscribe(([res1, res2]) => {
        this.stateProvinces = res1;
        this.contacDetailItem = res2;
        this.imageUrls = this.contacDetailItem.images;
      })
  }

  closePopup() {
    this.dialogRef.close(true);
  }

  editStatusContact(status: string) {
    this.contactService.changeStatusContact(this.itemContactList.id, status).subscribe(response => {
      switch (status) {
        case 'DaDuyet': {
          this.itemContactList.status.key = 'DaDuyet';
          break;
        }
        case 'DangXacMinh': {
          this.itemContactList.status.key = 'DangXacMinh';
          break;
        }
        case 'HuyBo': {
          this.itemContactList.status.key = 'HuyBo';
          break;
        }
      }
    });
  }


}
