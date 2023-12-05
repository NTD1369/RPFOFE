/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RelationShipComponent } from './relationShip.component';

describe('RelationShipComponent', () => {
  let component: RelationShipComponent;
  let fixture: ComponentFixture<RelationShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
