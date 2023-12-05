/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_SyncDataStatusByIdocComponent } from './rpt_SyncDataStatusByIdoc.component';

describe('Rpt_SyncDataStatusByIdocComponent', () => {
  let component: Rpt_SyncDataStatusByIdocComponent;
  let fixture: ComponentFixture<Rpt_SyncDataStatusByIdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_SyncDataStatusByIdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_SyncDataStatusByIdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
