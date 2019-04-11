import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.scss']
})
export class ListErrorsComponent {

  formattedErrors: string;

  @Input('errorCode') errorCode: string;

  ngOnChanges() {
    this.formattedErrors = this.errorCode;
  }

}
