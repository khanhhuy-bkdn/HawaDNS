import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThousandSeparatePipe } from './thousand-separate.pipe';
import { TruncateTextPipe } from './truncate-text.pipe';

@NgModule({
  declarations: [
    ThousandSeparatePipe,
    TruncateTextPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ThousandSeparatePipe,
    TruncateTextPipe
  ]
})
export class PipeModule { }
