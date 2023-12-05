/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptLogComponent } from './rpt-log.component';

describe('RptLogComponent', () => {
  let component: RptLogComponent;
  let fixture: ComponentFixture<RptLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
