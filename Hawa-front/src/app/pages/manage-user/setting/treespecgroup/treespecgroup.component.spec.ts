import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreespecgroupComponent } from './treespecgroup.component';

describe('TreespecgroupComponent', () => {
  let component: TreespecgroupComponent;
  let fixture: ComponentFixture<TreespecgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreespecgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreespecgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
