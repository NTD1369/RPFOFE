/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopToolLoading-2Component } from './shop-tool-loading-2.component';

describe('ShopToolLoading-2Component', () => {
  let component: ShopToolLoading-2Component;
  let fixture: ComponentFixture<ShopToolLoading-2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopToolLoading-2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToolLoading-2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
