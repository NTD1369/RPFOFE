/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RPT_SyncDataStatusViewComponent } from './RPT_SyncDataStatusView.component';

describe('RPT_SyncDataStatusViewComponent', () => {
  let component: RPT_SyncDataStatusViewComponent;
  let fixture: ComponentFixture<RPT_SyncDataStatusViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RPT_SyncDataStatusViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RPT_SyncDataStatusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
