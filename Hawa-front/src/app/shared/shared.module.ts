import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberDirective } from './directives/input-number.directive';
import { EnterPreventDefaultDirective } from './directives/enter-prevent-default.directive';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../@theme/theme.module';
import { NbDialogModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { ListErrorsComponent } from './shared-components/list-errors/list-errors.component';
import { PaginationComponent } from './shared-components/pagination/pagination.component';
import { ActorPopupComponent } from './components/popups/actor-popup/actor-popup.component';
import { InformationIndirectComponent } from './components/popups/information-indirect/information-indirect.component';
import { IndirectContactAssessmentComponent } from './components/popups/indirect-contact-assessment/indirect-contact-assessment.component';
import { ChangePasswordComponent } from './components/popups/change-password/change-password.component';
import { RateStarComponent } from './components/rate-star/rate-star.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContributingInformationFormComponent } from './components/popups/contributing-information-form/contributing-information-form.component';
import { ContributingInformationDetailComponent } from './components/popups/contributing-information-detail/contributing-information-detail.component';
import { PipeModule } from './pipe/pipe.module';
import { LoginRequiredComponent } from './components/popups/login-required/login-required.component';
import { ComingSoonComponent } from './components/popups/coming-soon/coming-soon.component';
// import { NouisliderModule } from 'ng2-nouislider';
import { ConfirmationPopupComponent } from './shared-components/confirmation-popup/confirmation-popup.component';
import { MomentModule } from 'angular2-moment';
import { InputKeyDirective } from './directives/input-key.directive';
import { PopupComponent } from './components/popups/popup/popup.component';
import { PaginationFiveComponent } from './shared-components/pagination-five/pagination-five.component';
import { ImageCarouselComponent } from './shared-components/image-carousel/image-carousel.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { Ng5SliderModule } from 'ng5-slider';
import { GoogleMapComponent } from './components/popups/google-map/google-map.component';
import { AgmCoreModule } from '@agm/core';
import { PopupErrorComponent } from './shared-components/popup-error/popup-error.component';
import { TreeSpeciesComponent } from './components/popups/tree-species/tree-species.component';
import { CreateTreeSpeciesComponent } from './components/popups/create-tree-species/create-tree-species.component';
import { HistoryTreeSpecies } from './components/popups/history-tree-species/history-tree-species.component';
import {ToastyModule} from 'ng2-toasty';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import 'hammerjs';
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    ThemeModule,
    NbDialogModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'transparent',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff'
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCtQZEu3a3_EcK7NDv_a4x3qMteGQxcp3Q'
    }),
    NgSelectModule,
    PipeModule,
    // NouisliderModule,
    MomentModule,
    RecaptchaModule.forRoot(),
    NgbDropdownModule.forRoot(),
    Ng5SliderModule ,
    ToastyModule.forRoot(),
    ChartsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [
    InputNumberDirective,
    EnterPreventDefaultDirective,
    ListErrorsComponent,
    PaginationComponent,
    ActorPopupComponent,
    InformationIndirectComponent,
    ContributingInformationDetailComponent,
    IndirectContactAssessmentComponent,
    ChangePasswordComponent,
    RateStarComponent,
    ContributingInformationFormComponent,
    LoginRequiredComponent,
    ComingSoonComponent,
    ConfirmationPopupComponent,
    InputKeyDirective,
    PopupComponent,
    PaginationFiveComponent,
    ImageCarouselComponent,
    GoogleMapComponent,
    PopupErrorComponent,
    TreeSpeciesComponent,
    CreateTreeSpeciesComponent,
    HistoryTreeSpecies,
  ],
  exports: [
    AgmCoreModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InputNumberDirective,
    EnterPreventDefaultDirective,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    ThemeModule,
    NbDialogModule,
    ListErrorsComponent,
    PaginationComponent,
    RateStarComponent,
    NgxLoadingModule,
    NgSelectModule,
    PipeModule,
    // NouisliderModule,
    MomentModule,
    InputKeyDirective,
    ConfirmationPopupComponent,
    PopupComponent,
    RecaptchaModule,
    Ng5SliderModule,
    GoogleMapComponent,
    PopupErrorComponent,
    NgbDropdownModule,
    ChartsModule,
    NgxDaterangepickerMd
  ],
  entryComponents: [
    ActorPopupComponent,
    InformationIndirectComponent,
    ContributingInformationDetailComponent,
    IndirectContactAssessmentComponent,
    ChangePasswordComponent,
    LoginRequiredComponent,
    ContributingInformationFormComponent,
    ComingSoonComponent,
    ConfirmationPopupComponent,
    PopupComponent,
    GoogleMapComponent,
    TreeSpeciesComponent,
    CreateTreeSpeciesComponent,
    HistoryTreeSpecies,
  ],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'vi',
    },
  ],
})
export class SharedModule { }
