/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopToolPromotionDetailViewComponent } from './shop-tool-promotion-detail-view.component';

describe('ShopToolPromotionDetailViewComponent', () => {
  let component: ShopToolPromotionDetailViewComponent;
  let fixture: ComponentFixture<ShopToolPromotionDetailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopToolPromotionDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToolPromotionDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
