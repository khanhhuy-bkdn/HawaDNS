import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {

  @Input() imageUrlArray;
  @Input() indexOfImage;
  @Output() closed = new EventEmitter<boolean>();
  slideIndex = 1;
  i = 0;
  isShow;
  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27) { this.closed.emit(true); }
    });
    document.addEventListener('keyup', e => {
      if (e.keyCode === 37) { this.prevButton(); }
    });
    document.addEventListener('keyup', e => {
      if (e.keyCode === 39) { this.nextButton(); }
    });
    this.i = this.indexOfImage || 0;
    this.showOneImage(this.i);
  }
  prevButton() {
    if (this.isShow > 0) {
      this.isShow -= 1;
      this.showOneImage(this.isShow);
    } else {
      this.isShow = this.imageUrlArray.length - 1;
    }
  }
  nextButton() {
    if (this.isShow < this.imageUrlArray.length - 1) {
      this.isShow += 1;
      this.showOneImage(this.isShow);
    } else {
      this.isShow = 0;
    }
  }
  showOneImage(i) {
    this.isShow = i;
  }
  closeView() {
    this.closed.emit(true);
  }
  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }
  viewCurrentImage(index) {
    this.isShow = index;
  }

}
