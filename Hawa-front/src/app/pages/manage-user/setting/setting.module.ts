import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { TreespecgroupComponent } from './treespecgroup/treespecgroup.component';
import { CreateTreeSpecGroupPopupComponent } from './treespecgroup/create-tree-spec-group-popup/create-tree-spec-group-popup.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProvinceCityComponent } from './province-city/province-city.component';

@NgModule({
  declarations: [
    SettingComponent,
    TreespecgroupComponent,
    CreateTreeSpecGroupPopupComponent,
    ProvinceCityComponent
  ],
  entryComponents: [
    CreateTreeSpecGroupPopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
