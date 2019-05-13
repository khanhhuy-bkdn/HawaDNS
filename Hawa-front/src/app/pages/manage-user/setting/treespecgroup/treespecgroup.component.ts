import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CreateTreeSpecGroupPopupComponent } from './create-tree-spec-group-popup/create-tree-spec-group-popup.component';
import { TreeSpecGroup } from '../../../../shared/model/setting/tree-spec-group/tree-spec-group.model';
import { TreeSpecGroupService } from '../../../../shared/service/setting/tree-spec-group.service';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { PopupComponent } from '../../../../shared/components/popups/popup/popup.component';
import { AlertService } from '../../../../shared/service/alert.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'treespecgroup',
  templateUrl: './treespecgroup.component.html',
  styleUrls: ['./treespecgroup.component.scss']
})
export class TreespecgroupComponent implements OnInit {
  pagedResult: PagedResult<TreeSpecGroup> = new PagedResult<TreeSpecGroup>();
  listOfTreeSpecGroup = new Array<TreeSpecGroup>();
  searchTerm$ = new BehaviorSubject<string>('');
  loading = false;
  constructor(
    private dialogService: NbDialogService,
    private treeSpecGroupService: TreeSpecGroupService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.treeSpecGroupService.getListTreeSpecGroup(this.searchTerm$, this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(res => {
      this.rerender(res);
    })
  }

  rerender(result: any) {
    this.listOfTreeSpecGroup = result.items;
    this.pagedResult = result;
    this.loading = false;
  }
  pagedResultChange(pagedResult) {
    this.loading = true;
    this.treeSpecGroupService
      .getListTreeSpecGroup(this.searchTerm$, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => this.rerender(result));
  }

  onSelectAll(value: boolean) {
    this.listOfTreeSpecGroup.forEach(x => (x['checked'] = value));
  }

  deleteTreeSpecGroup(treeSpecName: string, treeSpecId: number | string) {
    // const treeSpecGroupsDelete = this.listOfTreeSpecGroup.filter(treeSpecGroup => treeSpecGroup.checked === true);
    // if (treeSpecGroupsDelete.length > 0) {
    //   return this.deleteMultiTreeSpecGroup(treeSpecGroupsDelete);
    // } else {
    this.dialogService.open(PopupComponent, {
      context: {
        showModel: {
          title: 'Xóa nhóm loài cây',
          notices: [
            'Bạn có chắc muốn xóa nhóm',
            `<strong>${treeSpecName}</strong>`
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
        this.treeSpecGroupService.deleteTreeSpecGroup(treeSpecId).subscribe(res => {
          this.alertService.success(`Đã xóa nhóm ${treeSpecName}`);
          this.treeSpecGroupService.getListTreeSpecGroup(this.searchTerm$, this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(res => this.rerender(res))
        })
      }
    })
    // }
  }
  deleteMultiTreeSpecGroup(treeSpecGroupsDelete) {
    const treeSpecGroupIds = treeSpecGroupsDelete.map(treeSpecGroup => treeSpecGroup.id);
    // this.treeSpecGroupService.
  }
  detailTreeSpecGroup(treeSpecGroupId) {
    this.openTreeSpecGroupPopup('chi tiết nhóm loài cây', 'detail', treeSpecGroupId);
  }
  editTreeSpecGroup(treeSpecGroupId) {
    this.openTreeSpecGroupPopup('chỉnh sửa nhóm loài cây', 'edit', treeSpecGroupId);
  }
  createTreeSpecGroup() {
    this.openTreeSpecGroupPopup('tạo mới nhóm loài cây', 'create', null);
  }
  openTreeSpecGroupPopup(title: string, action: string, id: number | string) {
    this.dialogService
      .open(CreateTreeSpecGroupPopupComponent, {
        context: {
          title: title,
          action: action,
          id: id
        },
      })
      .onClose.subscribe(value => {
        if (!value) {
          return;
        }
        if (value) {
          this.treeSpecGroupService.getListTreeSpecGroup(this.searchTerm$, this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(res => this.rerender(res));
        }
      });
  }
}
