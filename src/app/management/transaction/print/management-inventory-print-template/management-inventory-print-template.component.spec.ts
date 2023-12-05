/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ManagementInventoryPrintTemplateComponent } from './management-inventory-print-template.component';


describe('ShopComponentOrderPrintComponent', () => {
  let component: ManagementInventoryPrintTemplateComponent;
  let fixture: ComponentFixture<ManagementInventoryPrintTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInventoryPrintTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInventoryPrintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
