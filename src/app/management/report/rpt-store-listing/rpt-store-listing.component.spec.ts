/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptStoreListingComponent } from './rpt-store-listing.component';

describe('RptStoreListingComponent', () => {
  let component: RptStoreListingComponent;
  let fixture: ComponentFixture<RptStoreListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptStoreListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptStoreListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
