/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInventoryCoutingPrintComponent } from './management-inventory-couting-print.component';

describe('ManagementInventoryCoutingPrintComponent', () => {
  let component: ManagementInventoryCoutingPrintComponent;
  let fixture: ComponentFixture<ManagementInventoryCoutingPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInventoryCoutingPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInventoryCoutingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
