/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopToolClearCacheComponent } from './shop-tool-clear-cache.component';

describe('ShopToolClearCacheComponent', () => {
  let component: ShopToolClearCacheComponent;
  let fixture: ComponentFixture<ShopToolClearCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopToolClearCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToolClearCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
