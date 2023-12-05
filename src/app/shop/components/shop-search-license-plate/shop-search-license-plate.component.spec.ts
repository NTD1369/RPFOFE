/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopSearchLicensePlateComponent } from './shop-search-license-plate.component';

describe('ShopSearchLicensePlateComponent', () => {
  let component: ShopSearchLicensePlateComponent;
  let fixture: ComponentFixture<ShopSearchLicensePlateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSearchLicensePlateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSearchLicensePlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
