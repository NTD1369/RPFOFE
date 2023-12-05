/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGoodsReturnPrintComponent } from './management-goodsreturn-print.component';

describe('ManagementGRPOPrintComponent', () => {
  let component: ManagementGoodsReturnPrintComponent;
  let fixture: ComponentFixture<ManagementGoodsReturnPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementGoodsReturnPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementGoodsReturnPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
