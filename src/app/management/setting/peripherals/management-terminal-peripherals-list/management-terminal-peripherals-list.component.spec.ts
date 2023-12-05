/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTerminalPeripheralsListComponent } from './management-terminal-peripherals-list.component';

describe('ManagementTerminalPeripheralsListComponent', () => {
  let component: ManagementTerminalPeripheralsListComponent;
  let fixture: ComponentFixture<ManagementTerminalPeripheralsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTerminalPeripheralsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTerminalPeripheralsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
