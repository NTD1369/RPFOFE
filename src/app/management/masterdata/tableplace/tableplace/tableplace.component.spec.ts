/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableplaceComponent } from './tableplace.component';

describe('TableplaceComponent', () => {
  let component: TableplaceComponent;
  let fixture: ComponentFixture<TableplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
