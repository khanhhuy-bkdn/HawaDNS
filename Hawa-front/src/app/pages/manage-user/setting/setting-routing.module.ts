import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { TreespecgroupComponent } from './treespecgroup/treespecgroup.component';
import { ProvinceCityComponent } from './province-city/province-city.component';

const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      { path: '', redirectTo: 'treespecgroup' },
      { path: 'treespecgroup', component: TreespecgroupComponent },
      { path: 'province-city', component: ProvinceCityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
