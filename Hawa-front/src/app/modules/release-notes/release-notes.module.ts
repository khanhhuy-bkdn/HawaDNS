import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ReleaseNotesComponent } from './release-notes.component';
import { ReleaseNotesRoutingModule } from './release-notes-routing.module';

@NgModule({
  declarations: [ReleaseNotesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ReleaseNotesRoutingModule,
  ],
})
export class ReleaseNotesModule { }
