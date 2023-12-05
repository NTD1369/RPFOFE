import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private paramSource = new BehaviorSubject(null);
  sharedParam = this.paramSource.asObservable();
  constructor() { }

  changeParam(param: any[]) {
    console.log("param", param);
    this.paramSource.next(param)
  }

  // Tranfer Receipt
  private paramSourceTranferReceipt = new BehaviorSubject(null);
  sharedParamTranferReceipt = this.paramSourceTranferReceipt.asObservable();

  changeParamTranferReceipt(param: any[]) {
    console.log("param tranfer receipt", param);
    this.paramSourceTranferReceipt.next(param)
  }

  // Tranfer Shipment
  private paramSourceTranferShipment = new BehaviorSubject(null);
  sharedParamTranferShipment = this.paramSourceTranferShipment.asObservable();

  changeParamTranferShipment(param: any[]) {
    console.log("param tranfer Shipment", param);
    this.paramSourceTranferShipment.next(param)
  }

  // Goods Issue
  private paramSourceGoodsIssue = new BehaviorSubject(null);
  sharedParamGoodsIssue = this.paramSourceGoodsIssue.asObservable();

  changeParamGoodsIssue(param: any[]) {
    console.log("param goods issue", param);
    this.paramSourceGoodsIssue.next(param)
  }

  // Goods Receipt
  private paramSourceGoodsReceipt = new BehaviorSubject(null);
  sharedParamGoodsReceipt = this.paramSourceGoodsReceipt.asObservable();

  changeParamGoodsReceipt(param: any[]) {
    console.log("param goods receipt", param);
    this.paramSourceGoodsReceipt.next(param)
  }


  // Inventory counting
  private paramSourceInvCouting = new BehaviorSubject(null);
  sharedParamInvCouting = this.paramSourceInvCouting.asObservable();

  changeParamInvCouting(param: any[]) {
    console.log("param counting", param);
    this.paramSourceInvCouting.next(param)
  }

  // Inventory posting
  private paramSourceInvPosting = new BehaviorSubject(null);
  sharedParamInvPosting = this.paramSourceInvPosting.asObservable();

  changeParamInvPosting(param: any[]) {
    console.log("param posting", param);
    this.paramSourceInvPosting.next(param)
  }

  // Goods receipt PO
  private paramSourceGoodsReceiptPO = new BehaviorSubject(null);
  sharedParamGoodsReceiptPO = this.paramSourceGoodsReceiptPO.asObservable();

  changeParamGoodsReceiptPO(param: any[]) {
    console.log("param goods receipt PO", param);
    this.paramSourceGoodsReceiptPO.next(param)
  }

  // Purchase order
  private paramSourcePurchaseOrder = new BehaviorSubject(null);
  sharedParamPurchaseOrder = this.paramSourcePurchaseOrder.asObservable();

  changeParamPurchaseOrder(param: any[]) {
    console.log("param purchase order", param);
    this.paramSourcePurchaseOrder.next(param)
  }
}
