/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptPosPromotionNewComponent } from './rpt-pos-promotion-new.component';

describe('RptPosPromotionNewComponent', () => {
  let component: RptPosPromotionNewComponent;
  let fixture: ComponentFixture<RptPosPromotionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptPosPromotionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptPosPromotionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
