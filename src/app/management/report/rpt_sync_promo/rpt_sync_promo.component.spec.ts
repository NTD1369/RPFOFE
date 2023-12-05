/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_sync_promoComponent } from './rpt_sync_promo.component';

describe('Rpt_sync_promoComponent', () => {
  let component: Rpt_sync_promoComponent;
  let fixture: ComponentFixture<Rpt_sync_promoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_sync_promoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_sync_promoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
