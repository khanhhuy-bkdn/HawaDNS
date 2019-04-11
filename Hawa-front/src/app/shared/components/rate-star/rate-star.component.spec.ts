import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateStarComponent } from './rate-star.component';

describe('RateStarComponent', () => {
  let component: RateStarComponent;
  let fixture: ComponentFixture<RateStarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateStarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
