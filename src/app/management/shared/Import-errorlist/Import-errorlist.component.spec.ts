/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportErrorlistComponent } from './Import-errorlist.component';

describe('ImportErrorlistComponent', () => {
  let component: ImportErrorlistComponent;
  let fixture: ComponentFixture<ImportErrorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportErrorlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportErrorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
