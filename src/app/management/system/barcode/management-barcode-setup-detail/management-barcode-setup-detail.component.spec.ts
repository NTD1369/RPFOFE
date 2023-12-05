/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementBarcodeSetupDetailComponent } from './management-barcode-setup-detail.component';

describe('ManagementBarcodeSetupDetailComponent', () => {
  let component: ManagementBarcodeSetupDetailComponent;
  let fixture: ComponentFixture<ManagementBarcodeSetupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementBarcodeSetupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementBarcodeSetupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
