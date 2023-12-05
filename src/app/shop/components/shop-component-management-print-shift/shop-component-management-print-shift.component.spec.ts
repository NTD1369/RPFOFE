/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ShopComponentManagementPrintShiftComponent } from './shop-component-management-print-shift.component';


describe('ShopComponentManagementPrintShiftComponent', () => {
  let component: ShopComponentManagementPrintShiftComponent;
  let fixture: ComponentFixture<ShopComponentManagementPrintShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopComponentManagementPrintShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponentManagementPrintShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
