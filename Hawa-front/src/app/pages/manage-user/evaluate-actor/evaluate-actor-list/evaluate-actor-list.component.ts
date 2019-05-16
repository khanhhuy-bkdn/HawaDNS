import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterEvaluateContactListManager } from '../../../../shared/model/evaluate-contact/filter-evaluate-contact-list-manager.model';
import { Router } from '@angular/router';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { EvaluateActorFilterManager } from '../../../../shared/model/evaluate-actor/evaluate-actor-filter-manager.model';
import { EMPTY, BehaviorSubject, Observable } from 'rxjs';
import { ThemeSettingsComponent } from '../../../../@theme/components';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { EvaluateActorListManager } from '../../../../shared/model/evaluate-actor/evaluate-actor-list-manager.model';
import { ImportDataActorService } from '../../../../shared/service/actor/import-data-actor.service';
import { AlertService } from '../../../../shared/service/alert.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'ts-xlsx';
import { ItemUnit } from '../../../../shared/model/dictionary/item-unit.model';
@Component({
  selector: 'evaluate-actor-list',
  templateUrl: './evaluate-actor-list.component.html',
  styleUrls: ['./evaluate-actor-list.component.scss']
})
export class EvaluateActorListComponent implements OnInit {
  @ViewChild('importDataActor') importDataActor;
  filterModel = new EvaluateActorFilterManager();
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  compartments: AdministrativeUnit[];
  subCompartments: AdministrativeUnit[];
  pagedResult: PagedResult<EvaluateActorListManager> = new PagedResult<EvaluateActorListManager>();
  loading = false;
  searchTerm$ = new BehaviorSubject<string>('');
  isOnInit = false;
  loadingtable = false;

  arrayBuffer: any;
  currentRow: number;
  constructor(
    private router: Router,
    private manageEvaluateService: ManageEvaluateService,
    private dataGeneralService: DataGeneralService,
    private importDataActorService: ImportDataActorService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.manageEvaluateService.filterModelListActor) {
      this.filterModel.stateProvinceId = this.manageEvaluateService.filterModelListActor.stateProvinceId;
      this.filterModel.districtId = this.manageEvaluateService.filterModelListActor.districtId;
      this.filterModel.communeId = this.manageEvaluateService.filterModelListActor.communeId;
      this.filterModel.compartmentId = this.manageEvaluateService.filterModelListActor.compartmentId;
      this.filterModel.subCompartmentId = this.manageEvaluateService.filterModelListActor.subCompartmentId;
    } else {
      this.filterModel.stateProvinceId = null;
      this.filterModel.districtId = null;
      this.filterModel.communeId = null;
      this.filterModel.compartmentId = null;
      this.filterModel.subCompartmentId = null;
    }
    this.dataGeneralService.getProvinces().switchMap(data => {
      this.stateProvinces = data;

      if (this.manageEvaluateService.filterModelListActor) {
        if (this.manageEvaluateService.filterModelListActor.stateProvinceId) {
          const stateProvinces = this.stateProvinces.filter(item => item.key == this.manageEvaluateService.filterModelListActor.stateProvinceId.toString())[0];
          return this.dataGeneralService.getDistricts(stateProvinces.code)
        } else {
          return EMPTY;
        }
      } else {
        return EMPTY;
      }
    })
      .switchMap(dataDistrict => {
        this.districts = dataDistrict;
        if (this.manageEvaluateService.filterModelListActor.districtId) {
          const districtID = this.districts.filter(item => item.key == this.manageEvaluateService.filterModelListActor.districtId.toString())[0];
          if (this.filterModel.districtId) {
            return this.dataGeneralService.getWards(districtID.code)
          }
        } else {
          return EMPTY;
        }
      }).switchMap(dataCommunes => {
        this.communes = dataCommunes;
        if (this.manageEvaluateService.filterModelListActor.communeId) {
          // const communeId = this.communes.filter(item => item.key == this.manageEvaluateService.filterModelListActor.communeId.toString())[0];
          if (this.filterModel.communeId) {
            return this.dataGeneralService.getCompartments(this.manageEvaluateService.filterModelListActor.communeId)
          }
        } else {
          return EMPTY;
        }
      })
      .switchMap(dataCompartments => {
        this.compartments = dataCompartments;
        if (this.manageEvaluateService.filterModelListActor.subCompartmentId) {
          // const subCompartmentId = this.compartments.filter(item => item.key == this.manageEvaluateService.filterModelListActor.compartmentId.toString())[0];
          if (this.filterModel.compartmentId) {
            return this.dataGeneralService.getSubCompartments(this.manageEvaluateService.filterModelListActor.subCompartmentId)
          }
        } else {
          return EMPTY;
        }
      })
      .subscribe(dataSubCompartments => {
        this.subCompartments = dataSubCompartments;
      })
    // this.manageEvaluateService.actorListForEvaluate(this.filterModel,
    //   this.manageEvaluateService.currentPageActor ? this.manageEvaluateService.currentPageActor : 0,
    //   this.manageEvaluateService.pageSizeActor ? this.manageEvaluateService.pageSizeActor : 10).subscribe(response => {
    //     this.render(response);
    //   })

    if (this.manageEvaluateService.pageSizeActor) {
      this.pagedResult.pageSize = this.manageEvaluateService.pageSizeActor
    }
    this.searchTerm$.next(this.manageEvaluateService.searchTermActor ? this.manageEvaluateService.searchTermActor : '');

    this.searchTerm$.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.loadingtable = true;
      this.manageEvaluateService.actorListForEvaluate(this.searchTerm$.value, this.filterModel,
        (!this.isOnInit && this.manageEvaluateService.currentPageActor) ? this.manageEvaluateService.currentPageActor : 0,
        this.pagedResult.pageSize ? this.pagedResult.pageSize : 10).subscribe(response => {
          this.render(response);
        })
      this.isOnInit = true;
    });

    // this.manageEvaluateService.actorListForEvaluateSearchKeyWord(
    //   this.searchTerm$, this.filterModel,
    //   this.manageEvaluateService.currentPageActor ? this.manageEvaluateService.currentPageActor : 0,
    //   this.manageEvaluateService.pageSizeActor ? this.manageEvaluateService.pageSizeActor : 10
    // ).subscribe(response => {
    //   this.render(response);
    // });
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
    (this.pagedResult.items || []).forEach(item => {
      item.averageRating = +item.averageRating.toFixed(1);
    });
    this.loadingtable = false;
  }

  viewDetail(forestPlotId) {
    this.manageEvaluateService.filterModelListActor = this.filterModel;
    this.manageEvaluateService.currentPageActor = this.pagedResult.currentPage;
    this.manageEvaluateService.pageSizeActor = this.pagedResult.pageSize;
    this.manageEvaluateService.searchTermActor = this.searchTerm$.value;
    this.router.navigate([`/pages/evaluate-actor/detail/${forestPlotId}`]);
  }

  getDistricts(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.stateProvinceId = null;
    }
    const stateProvinces = this.stateProvinces.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.stateProvinceId) {
      this.dataGeneralService.getDistricts(stateProvinces.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.filterModel.districtId = null;
    this.communes = new Array<AdministrativeUnit>();
    this.filterModel.communeId = null;
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.districtId = null;
    }
    const districtID = this.districts.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.districtId) {
      this.dataGeneralService.getWards(districtID.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.filterModel.communeId = null;
  }

  getCompartments(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.communeId = null;
    }
    // const communeId = this.communes.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.communeId) {
      this.dataGeneralService.getCompartments(this.filterModel.communeId).subscribe(data => {
        this.compartments = data;
      });
    }
    this.filterModel.compartmentId = null;
  }

  getSubcompartments(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.compartmentId = null;
    }
    // const compartmentId = this.compartments.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.compartmentId) {
      this.dataGeneralService.getSubCompartments(this.filterModel.compartmentId).subscribe(data => {
        this.subCompartments = data;
      });
    }
    this.filterModel.subCompartmentId = null;
  }

  filter() {
    this.loadingtable = true;
    this.manageEvaluateService.actorListForEvaluate(
      this.searchTerm$.value,
      this.filterModel
      , this.pagedResult && this.pagedResult.currentPage ? this.pagedResult.currentPage : 0
      , this.pagedResult && this.pagedResult.pageSize ? this.pagedResult.pageSize : 10).subscribe(response => {
        this.render(response);
      })
  }

  clearFilter() {
    this.filterModel.stateProvinceId = null;
    this.filterModel.districtId = null;
    this.filterModel.communeId = null;
    this.filterModel.compartmentId = null;
    this.filterModel.subCompartmentId = null;
    this.filterModel.plotCode = null;
    this.filter();
  }

  pagedResultChange(pagedResult) {
    this.manageEvaluateService.actorListForEvaluate(this.searchTerm$.value, this.filterModel, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
    })
  }

  importDataActorFuc(event) {
    const fileList: FileList = event.target.files;
    this.checkFormatExcel(event).subscribe(result => {
      if (this.validateDataExcel(result)) {
        if (fileList.length > 0) {
          this.loading = true;
          this.importDataActorService.importDataActor(fileList[0]).subscribe(response => {
            // reload manager actor
            this.manageEvaluateService.actorListForEvaluate(this.searchTerm$.value, this.filterModel, this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(response => {
              this.render(response);
            })
            // alert message
            this.loading = false;
            this.importDataActor.nativeElement.value = "";
            if (response.importRows !== 0 && response.updateRows === 0) {
              this.alertService.success(`Import thành công dữ liệu của ${response.importRows} chủ rừng.`);
            }
            if (response.updateRows !== 0 && response.importRows === 0) {
              this.alertService.success(`Update thành công dữ liệu của ${response.updateRows} chủ rừng.`);
            }
            if (response.updateRows !== 0 && response.importRows !== 0) {
              this.alertService.success(`Import thành công dữ liệu của ${response.importRows} chủ rừng. Update thành công dữ liệu của ${response.updateRows} chủ rừng.`);
            }
          }, err => {
            this.loading = false;
            this.importDataActor.nativeElement.value = "";
            if (err._body && JSON.parse(err._body).errorCode === 'BusinessException') {
              this.alertService.error(`${JSON.parse(err._body).errorMessage}`);
            } else {
              this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
          })
        }
      }
      this.importDataActor.nativeElement.value = null;
    });
    
  }

  validateDataExcel(data): boolean {
    // Required row
    data = data.sort((a, b) => a['indexRow'] - b['indexRow']);
    let indexEmpty = null;
    for (let index = 0; index < data.length; index++) {
      if (!(+data[index]['indexRow'] === (index + 2))) {
        indexEmpty = index + 2;
        break;
      }
    }
    if (indexEmpty) {
      this.alertService.error(`Dữ liệu đang trống ở dòng ${indexEmpty}`);
      return false;
    }
    // Required tên chủ rừng
    const isActorName = data.every((item, index) => {
      if (!item['Tên Chủ rừng']) {
        indexEmpty = index + 2;
        return false;
      }
      return true;
    });
    if (!isActorName) {
      this.alertService.error(`Vui lòng kiểm tra lại tên chủ rừng tại dòng ${indexEmpty}. Tên chủ rừng không được để trống`);
      return false;
    }
    // Required số điện thoại
    const isRequiredPhone = data.every((item, index) => {
      if (!item['Điện thoại']) {
        indexEmpty = index + 2;
        return false;
      }
      return true;
    });
    if (!isRequiredPhone) {
      this.alertService.error(`Vui lòng kiểm tra lại số điện thoại tại dòng ${indexEmpty}. Số điện thoại không được để trống`);
      return false;
    }
    // Check duplicate
    // Số điện thoại
    let numberPhoneDuplicate;
    const valueArrPhone = data.map(function (item) {
      return item['Điện thoại'];
    });
    const isDuplicatePhone = valueArrPhone.every(function (item, idx) {
      if (!(valueArrPhone.indexOf(item) === idx)) {
        numberPhoneDuplicate = item;
      }
      return valueArrPhone.indexOf(item) === idx;
    });
    if (!isDuplicatePhone) {
      this.alertService.error(`Không thể có 2 chủ rừng có cùng số điện thoại. Số điện thoại ${numberPhoneDuplicate} đang bị trùng`);
      return false;
    }
    // Email
    let emailDuplicate;
    const valueArrEmail = data.filter(item => item['Email']).map(itemMap => itemMap['Email']);
    const isDuplicateEmail = valueArrEmail.every(function (item, idx) {
      if (!(valueArrEmail.indexOf(item) === idx)) {
        emailDuplicate = item;
      }
      return valueArrEmail.indexOf(item) === idx;
    });
    if (!isDuplicateEmail) {
      this.alertService.error(`Không thể có 2 chủ rừng có cùng email. Email ${emailDuplicate} đang bị trùng`);
      return false;
    }

    // Check định dang, đúng ký tự
    // Email
    const isFromatEmail = data.every((item, index) => {
      if (item['Email']) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(item['Email']).toLowerCase())) {
          indexEmpty = index + 2;
        }
        return re.test(String(item['Email']).toLowerCase());
      }
      if (!item['Email']) {
        return true;
      }

    });
    if (!isFromatEmail) {
      this.alertService.error(`Vui lòng kiểm tra lại email tại dòng ${indexEmpty}. Email không đúng định dạng`);
      return false;
    }
    // Số điện thoại
    const arrayAllow = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '(', ')'];
    const isFromatNumberPhone = data.every((item, index) => {
      item['Điện thoại'] = item['Điện thoại'].replace(/\s/g, "");
      const arrayChar = item['Điện thoại'].split('');
      if (arrayChar && arrayChar.length >= 9 && arrayChar.length <= 15) {
        const isCheck = arrayChar.every(itemChar => {
          return arrayAllow.includes(itemChar);
        });
        if (!isCheck) {
          indexEmpty = index + 2;
        }
        return isCheck;
      } else {
        indexEmpty = index + 2;
        return false;
      }
    });
    if (!isFromatNumberPhone) {
      this.alertService.error(`Vui lòng kiểm tra lại số điện thoại tại dòng ${indexEmpty}. Số điện thoại không đúng định dạng`);
      return false;
    }
    // Trạng thái
    const isRequiredStatus = data.every((item, index) => {
      if (!item['Status']) {
        indexEmpty = index + 2;
        return false;
      }
      return true;
    });
    if (!isRequiredStatus) {
      this.alertService.error(`Vui lòng kiểm tra lại trạng thái tại dòng ${indexEmpty}. Trạng thái không được để trống`);
      return false;
    }
    // Định dang trạng thái
    const isRequiredFromatStatus = data.every((item, index) => {
      if (!((item['Status'] === 'New') || (item['Status'] === 'Update'))) {
        indexEmpty = index + 2;
        return false;
      }
      return true;
    });
    if (!isRequiredFromatStatus) {
      this.alertService.error(`Vui lòng kiểm tra lại trạng thái tại dòng ${indexEmpty}. Trạng thái không đúng định dạng`);
      return false;
    }
    return true;
  }

  checkFormatExcel(ev): Observable<any> {
    let workbook;
    let excelInJSON;

    const fileReader = new FileReader();

    // init read
    fileReader.readAsArrayBuffer((<any>ev.target).files[0]);

    return Observable.create(observer => {
      // if success
      fileReader.onload = ev => {
        let binary = "";
        let bytes = new Uint8Array((<any>ev.target).result);
        let length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        // Converts the excel data in to json
        workbook = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });
        // only first sheet
        excelInJSON = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const sheet_to_formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[workbook.SheetNames[0]]);
        let data = [];
        let objectValue = {};
        let currentRow = 1;
        const fieldName = {};
        sheet_to_formulae.forEach((itemFormulae, indexFormulae) => {
          const indexRow = itemFormulae.split('=')[0].substring(1, itemFormulae.split('=')[0].length);
          if (+indexRow === 1) {
            fieldName[itemFormulae.split('=')[0][0]] = itemFormulae.split('=')[1].replace("'", "").trim();
          }
          if (((+currentRow === +indexRow) && (+currentRow !== 1)) || ((+currentRow !== +indexRow) && (+currentRow === 2))) {
            objectValue[fieldName[itemFormulae.split('=')[0][0]]] = itemFormulae.split('=')[1].replace("'", "").trim();
          }
          if (((+currentRow !== +indexRow) && (+currentRow !== 1)) || (indexFormulae === sheet_to_formulae.length - 1)) {
            objectValue['indexRow'] = currentRow;
            data.push(objectValue);
            objectValue = {};
            objectValue[fieldName[itemFormulae.split('=')[0][0]]] = itemFormulae.split('=')[1].replace("'", "").trim();
          }
          currentRow = indexRow;
        });

        // sheet_to_formulae.map(itemFormulae => {
        //   if (itemFormulae.split('=')[0][0] === 'I') {
        //     const valueIndexRow = itemFormulae.split('=')[0][1];
        //     const valueNumberPhome = itemFormulae.split('=')[1].replace("'", "");
        //     const itemFind = excelInJSON.find(itemFind => itemFind['Điện thoại'] === valueNumberPhome.toString());
        //     if (itemFind) {
        //       itemFind['indexRow'] = valueIndexRow;
        //     }
        //   }
        // });

        observer.next(data);
      }

      // if failed
      fileReader.onerror = error => observer.error(error);
    });
  }
}

