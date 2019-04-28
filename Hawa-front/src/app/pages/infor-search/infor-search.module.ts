import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { InforSearchComponent } from './infor-search.component';
import { InforSearchRoutingModule } from './infor-search-routing.module';
import { InforFeedbackComponent } from './infor-feedback/infor-feedback.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { NouisliderModule } from 'ng2-nouislider';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InforSearchRoutingModule,
    NouisliderModule,
  ],
  declarations: [
    InforSearchComponent,
    InforFeedbackComponent,
    DetailComponent,
    ListComponent,
  ],
  entryComponents: [
    InforFeedbackComponent,
    DetailComponent,
  ],
})
export class InforSearchModule { }
