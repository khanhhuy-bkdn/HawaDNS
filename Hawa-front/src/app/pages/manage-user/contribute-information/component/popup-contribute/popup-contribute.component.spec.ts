import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupContributeComponent } from './popup-contribute.component';

describe('PopupContributeComponent', () => {
  let component: PopupContributeComponent;
  let fixture: ComponentFixture<PopupContributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupContributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupContributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
