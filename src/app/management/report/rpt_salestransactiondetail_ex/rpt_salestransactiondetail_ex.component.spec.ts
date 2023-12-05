/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_salestransactiondetail_exComponent } from './rpt_salestransactiondetail_ex.component';

describe('Rpt_salestransactiondetail_exComponent', () => {
  let component: Rpt_salestransactiondetail_exComponent;
  let fixture: ComponentFixture<Rpt_salestransactiondetail_exComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_salestransactiondetail_exComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_salestransactiondetail_exComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
