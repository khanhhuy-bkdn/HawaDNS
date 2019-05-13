import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TreeSpecGroup, TreeSpec } from '../../../../../shared/model/setting/tree-spec-group/tree-spec-group.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import ValidationHelper from '../../../../../helpers/validation.helper';
import { TreeSpecGroupService } from '../../../../../shared/service/setting/tree-spec-group.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from '../../../../../shared/service/alert.service';
import { PopupComponent } from '../../../../../shared/components/popups/popup/popup.component';

@Component({
  selector: 'create-tree-spec-group-popup',
  templateUrl: './create-tree-spec-group-popup.component.html',
  styleUrls: ['./create-tree-spec-group-popup.component.scss']
})
export class CreateTreeSpecGroupPopupComponent implements OnInit {
  // @Input() popupModel: TreeSpecGroup;
  @Input() title: string;
  @Input() action: string;
  @Input() id: number | string;
  popupModel: TreeSpecGroup;
  treeSpecGroupForm: FormGroup;
  listOfTreeSpec = new Array<TreeSpec>();
  listOfTreeSpecShow = new Array<TreeSpec>();
  listOfTreeSpecSelected = new Array<TreeSpec>();
  listSearchTreeSpecSelected = new Array<TreeSpec>();
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    name: ''
  };
  searchTerm$ = new BehaviorSubject<string>('');
  searchTermSelected$ = new BehaviorSubject<string>('');
  isChanged = false;
  constructor(
    private dialogRef: NbDialogRef<CreateTreeSpecGroupPopupComponent>,
    private fb: FormBuilder,
    private treeSpecGroupService: TreeSpecGroupService,
    private alertService: AlertService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit() {
    if (this.action == 'create') {
      this.popupModel = new TreeSpecGroup();
      this.createForm();
    } else {
      this.treeSpecGroupService.detailTreeSpecGroup(this.id).subscribe(res => {
        this.popupModel = res;
        this.listOfTreeSpecSelected = res.treeSpecs;
        this.createForm();
      })
    }
    this.treeSpecGroupService.getListOfTreeSpecs().subscribe(res => {
      this.listOfTreeSpec = res;
      this.listOfTreeSpecShow = res;
    });
    this.searchTerm$.subscribe(_ => {
      const treeSpecIds = this.listOfTreeSpecSelected.map(item => item.id);
      if (this.searchTerm$.value && this.searchTerm$.value !== '') {
        const tempArr = this.listOfTreeSpec.filter(item => item.name.toLowerCase().includes(this.searchTerm$.value.toLowerCase()));
        this.listOfTreeSpecShow = tempArr.filter(item => !(treeSpecIds.includes(item.id))).map(item => ({
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          latin: item.latin,
          geoDistribution: item.geoDistribution,
          isSpecialProduct: item.isSpecialProduct,
          checked: false
        }))
      } else {
        this.listOfTreeSpecShow = this.listOfTreeSpec.filter(item => !(treeSpecIds.includes(item.id))).map(item => ({
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          latin: item.latin,
          geoDistribution: item.geoDistribution,
          isSpecialProduct: item.isSpecialProduct,
          checked: false
        }));
      }
    })
  }
  createForm() {
    this.treeSpecGroupForm = this.fb.group({
      name: [this.popupModel.name, Validators.required],
      desc: this.popupModel.desc
    })
    if (this.treeSpecGroupForm && this.action == 'detail') {
      this.treeSpecGroupForm.disable();
    }
    this.treeSpecGroupForm.valueChanges.subscribe(_ => this.onFormValueChanged())
  }
  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.treeSpecGroupForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (this.listOfTreeSpecSelected.length == 0) {
        return this.showConfirm();
      } else {
        return this.createData();
      }
    }
  }

  createData() {
    const treeSpecIds = this.listOfTreeSpecSelected.map(item => item.id);
    if (this.action === 'create') {
      this.treeSpecGroupService.createTreeSpecGroup(this.treeSpecGroupForm.value, treeSpecIds).subscribe(res => {
        this.alertService.success('Tạo nhóm loài cây thành công.');
        this.closePopup(true);
      }, err => {
        this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.')
      })
    }
    if (this.action === 'edit') {
      this.treeSpecGroupService.editTreeSpecGroup(this.id, this.treeSpecGroupForm.value, treeSpecIds).subscribe(res => {
        this.alertService.success('Cập nhật nhóm loài cây thành công.');
        this.closePopup(true);
      }, err => {
        this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.')
      })
    }
  }

  showConfirm() {
    this.dialogService.open(PopupComponent, {
      context: {
        showModel: {
          title: `  `,
          notices: [
            `<strong>Bạn thực sự muốn tạo nhóm ${this.treeSpecGroupForm.get('name').value} mà không có loài cây nào?</strong>`
          ],
          actions: [
            {
              actionname: 'ok',
              actionvalue: true,
              actiontype: 'test'
            },
            {
              actionname: 'Tôi nhầm',
              actionvalue: false,
              actiontype: 'test'
            }
          ]
        }
      }
    }).onClose.subscribe(isConfirm => {
      if (isConfirm) {
        this.createData();
      }
    })
  }


  selectAll() {
    this.listOfTreeSpecSelected = this.listOfTreeSpec.map(item => ({
      id: item.id,
      name: item.name,
      acronym: item.acronym,
      latin: item.latin,
      geoDistribution: item.geoDistribution,
      isSpecialProduct: item.isSpecialProduct,
      checked: false
    }));
    this.listOfTreeSpecShow = new Array<TreeSpec>();
  }
  removeAll() {
    this.listOfTreeSpecSelected = new Array<TreeSpec>();
    this.listOfTreeSpecShow = this.listOfTreeSpec.map(item => ({
      id: item.id,
      name: item.name,
      acronym: item.acronym,
      latin: item.latin,
      geoDistribution: item.geoDistribution,
      isSpecialProduct: item.isSpecialProduct,
      checked: false
    }));
  }
  selectTreeSpec() {
    if (!this.isChanged && this.listOfTreeSpecShow.filter(treeSpec => treeSpec.checked === true).length > 0) {
      this.isChanged = true;
    }
    const treeSpecSelected = this.removeDuplicates([...this.listOfTreeSpecSelected, ...this.listOfTreeSpecShow.filter(treeSpec => treeSpec.checked === true)], 'id');
    this.listOfTreeSpecSelected = treeSpecSelected.map(item => ({
      id: item.id,
      name: item.name,
      acronym: item.acronym,
      latin: item.latin,
      geoDistribution: item.geoDistribution,
      isSpecialProduct: item.isSpecialProduct,
      checked: false
    }));
    this.listOfTreeSpecShow = this.listOfTreeSpecShow.filter(item => item.checked === false);
  }
  unselectTreeSpec() {
    if (!this.isChanged && this.listOfTreeSpecSelected.filter(treeSpec => treeSpec.checked === true).length > 0) {
      this.isChanged = true;
    }
    this.listOfTreeSpecShow = [...this.listOfTreeSpecSelected.filter(treeSpec => treeSpec.checked === true), ...this.listOfTreeSpecShow].map(item => ({
      id: item.id,
      name: item.name,
      acronym: item.acronym,
      latin: item.latin,
      geoDistribution: item.geoDistribution,
      isSpecialProduct: item.isSpecialProduct,
      checked: false
    }));
    setTimeout(_ => {
      this.listOfTreeSpecSelected = this.listOfTreeSpecSelected.filter(treeSpec => treeSpec.checked === false);
    })
  }

  removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject = {};

    for (let i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  editForm() {
    this.action = 'edit';
    this.treeSpecGroupForm.enable();
  }



  closedPopup() {
    if (this.action === 'detail') {
      return this.closePopup(false);
    } else {
      if (!this.isChanged) {
        return this.closePopup(false);
      } else {
        let header;
        switch (this.action) {
          case 'create':
            header = 'tạo';
            break;
          case 'edit':
            header = 'cập nhật';
            break;
        }
        this.dialogService.open(PopupComponent, {
          context: {
            showModel: {
              title: `Hủy ${header} nhóm loài cây`,
              notices: [
                'Bạn có chắc muốn thoát',
                `Xin lưu ý: Mọi sự thay đổi sẽ mất!`
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
        }).onClose.subscribe(isDeleteTreeSpecGroup => {
          if (isDeleteTreeSpecGroup) {
            this.closePopup(false);
          }
        })
      }
    }

  }

  closePopup(value: boolean) {
    if (!value) {
      return this.dialogRef.close();
    }
    if (value) {
      return this.dialogRef.close(true);
    }
  }
  changeData() {
    this.isChanged = true;
  }

}
