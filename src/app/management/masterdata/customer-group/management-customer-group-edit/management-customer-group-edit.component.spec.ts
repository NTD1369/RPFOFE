/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManagementCustomerGroupEditComponent } from './management-customer-group-edit.component';


describe('ManagementCustomerEditComponent', () => {
  let component: ManagementCustomerGroupEditComponent;
  let fixture: ComponentFixture<ManagementCustomerGroupEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementCustomerGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementCustomerGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
