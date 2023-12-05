/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopItemSerialExpandComponent } from './shop-item-serial-expand.component';

describe('ShopItemSerialExpandComponent', () => {
  let component: ShopItemSerialExpandComponent;
  let fixture: ComponentFixture<ShopItemSerialExpandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopItemSerialExpandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopItemSerialExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
