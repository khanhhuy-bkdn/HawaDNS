import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateContactDetailComponent } from './evaluate-contact-detail.component';

describe('EvaluateContactDetailComponent', () => {
  let component: EvaluateContactDetailComponent;
  let fixture: ComponentFixture<EvaluateContactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateContactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
