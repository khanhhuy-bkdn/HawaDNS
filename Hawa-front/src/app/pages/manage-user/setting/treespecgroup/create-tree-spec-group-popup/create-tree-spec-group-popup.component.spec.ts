import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTreeSpecGroupPopupComponent } from './create-tree-spec-group-popup.component';

describe('CreateTreeSpecGroupPopupComponent', () => {
  let component: CreateTreeSpecGroupPopupComponent;
  let fixture: ComponentFixture<CreateTreeSpecGroupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTreeSpecGroupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTreeSpecGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
