/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestUomComponent } from './test-uom.component';

describe('TestUomComponent', () => {
  let component: TestUomComponent;
  let fixture: ComponentFixture<TestUomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestUomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
