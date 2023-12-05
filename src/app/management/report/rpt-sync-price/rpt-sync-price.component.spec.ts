/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptSyncPriceComponent } from './rpt-sync-price.component';

describe('RptSyncPriceComponent', () => {
  let component: RptSyncPriceComponent;
  let fixture: ComponentFixture<RptSyncPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptSyncPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptSyncPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
