/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DmUomEditComponent } from './dm-uom-edit.component';

describe('DmUomEditComponent', () => {
  let component: DmUomEditComponent;
  let fixture: ComponentFixture<DmUomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmUomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmUomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
