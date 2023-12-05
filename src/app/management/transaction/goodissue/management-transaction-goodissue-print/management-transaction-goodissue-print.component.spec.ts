/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGoodIssuePrintComponent } from './management-transaction-goodissue-print.component';

describe('ManagementGoodIssuePrintComponent', () => {
  let component: ManagementGoodIssuePrintComponent;
  let fixture: ComponentFixture<ManagementGoodIssuePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementGoodIssuePrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementGoodIssuePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
