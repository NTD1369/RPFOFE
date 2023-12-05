/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_inventory_postingComponent } from './rpt_inventory_posting.component';

describe('Rpt_inventory_postingComponent', () => {
  let component: Rpt_inventory_postingComponent;
  let fixture: ComponentFixture<Rpt_inventory_postingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_inventory_postingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_inventory_postingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
