/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestDashboard2Component } from './test-dashboard2.component';

describe('TestDashboard2Component', () => {
  let component: TestDashboard2Component;
  let fixture: ComponentFixture<TestDashboard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestDashboard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDashboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
