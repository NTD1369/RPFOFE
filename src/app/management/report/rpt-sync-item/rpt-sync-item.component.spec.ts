/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptSyncItemComponent } from './rpt-sync-item.component';

describe('RptSyncItemComponent', () => {
  let component: RptSyncItemComponent;
  let fixture: ComponentFixture<RptSyncItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptSyncItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptSyncItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
