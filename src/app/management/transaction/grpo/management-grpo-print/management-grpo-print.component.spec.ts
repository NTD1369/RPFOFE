/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGRPOPrintComponent } from './management-grpo-print.component';

describe('ManagementGRPOPrintComponent', () => {
  let component: ManagementGRPOPrintComponent;
  let fixture: ComponentFixture<ManagementGRPOPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementGRPOPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementGRPOPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
