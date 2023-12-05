/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ShopComponentManagementPrintEndOfDateComponent } from './shop-component-management-print-endofdate.component';


describe('ShopComponentManagementPrintShiftComponent', () => {
  let component: ShopComponentManagementPrintEndOfDateComponent;
  let fixture: ComponentFixture<ShopComponentManagementPrintEndOfDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopComponentManagementPrintEndOfDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponentManagementPrintEndOfDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
