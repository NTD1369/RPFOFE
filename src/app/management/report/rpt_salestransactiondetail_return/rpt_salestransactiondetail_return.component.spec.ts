/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_salestransactiondetail_returnComponent } from './rpt_salestransactiondetail_return.component';

describe('Rpt_salestransactiondetail_returnComponent', () => {
  let component: Rpt_salestransactiondetail_returnComponent;
  let fixture: ComponentFixture<Rpt_salestransactiondetail_returnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_salestransactiondetail_returnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_salestransactiondetail_returnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
