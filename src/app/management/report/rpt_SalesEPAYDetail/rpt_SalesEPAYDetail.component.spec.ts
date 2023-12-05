/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_SalesEPAYDetailComponent } from './rpt_SalesEPAYDetail.component';

describe('Rpt_SalesEPAYDetailComponent', () => {
  let component: Rpt_SalesEPAYDetailComponent;
  let fixture: ComponentFixture<Rpt_SalesEPAYDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_SalesEPAYDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_SalesEPAYDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
