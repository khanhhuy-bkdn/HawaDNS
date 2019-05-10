import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateContactListComponent } from './evaluate-contact-list.component';

describe('EvaluateContactListComponent', () => {
  let component: EvaluateContactListComponent;
  let fixture: ComponentFixture<EvaluateContactListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateContactListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
