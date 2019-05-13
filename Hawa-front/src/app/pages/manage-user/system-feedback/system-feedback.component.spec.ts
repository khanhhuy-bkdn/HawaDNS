import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFeedbackComponent } from './system-feedback.component';

describe('SystemFeedbackComponent', () => {
  let component: SystemFeedbackComponent;
  let fixture: ComponentFixture<SystemFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
