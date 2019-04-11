import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupComponent } from '../shared-components/confirmation-popup/confirmation-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(
    private modalService: NgbModal
  ) { }

  confirm(message: string, siFn: () => void) {
    this.openConfirmationPopup({
      type: "confirm",
      text: message,
      siFn: function () {
        siFn();
      }
    });
  }

  openConfirmationPopup(message) {
    const modalRef = this.modalService.open(ConfirmationPopupComponent);
    modalRef.componentInstance.message = message;
  }
}
