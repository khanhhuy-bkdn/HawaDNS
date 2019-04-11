import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputNumber]'
})
export class InputNumberDirective {

  constructor(
  ) {
  }
  getKey(e: KeyboardEvent) {
    return e.keyCode || e.charCode;
  }

  getCharCode(e: KeyboardEvent) {
    return e.charCode || e.keyCode || e.which;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {


    if (e.ctrlKey || e.altKey) {
      return;
    }

    let k = this.getKey(e);

    let c = this.getCharCode(e);
    let cc = String.fromCharCode(c);
    let ok = true;


    ok = /[\d\.]/.test(cc);

    if (!ok) {
      e.preventDefault();
    }
  }

}
