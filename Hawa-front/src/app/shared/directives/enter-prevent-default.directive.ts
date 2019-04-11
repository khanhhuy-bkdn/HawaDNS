import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnterPreventDefault]'
})
export class EnterPreventDefaultDirective {

  constructor() { }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }
}
