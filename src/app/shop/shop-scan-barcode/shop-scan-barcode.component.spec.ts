/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShopScanBarcodeComponent } from './shop-scan-barcode.component';

describe('ShopScanBarcodeComponent', () => {
  let component: ShopScanBarcodeComponent;
  let fixture: ComponentFixture<ShopScanBarcodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShopScanBarcodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopScanBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
