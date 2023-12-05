/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManamentPrepaidHistoryComponent } from './manament-prepaid-history.component';

describe('ManamentPrepaidHistoryComponent', () => {
  let component: ManamentPrepaidHistoryComponent;
  let fixture: ComponentFixture<ManamentPrepaidHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManamentPrepaidHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManamentPrepaidHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
