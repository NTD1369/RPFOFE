import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  public host = '';
  public apiUrl = ''; 
  public apiMWIUrl = ''; 
  public mwiToken='';
  public terminalID = ''; 
  public merchantID ='';
  public printDelay =''; 
  public printLuckyDelay =''; 
  public printBarcodeWidth50cm ='1.7'; 
  public printBarcodeHeight50mm ='70'; 
  public printBarcodeWidth80cm ='2'; 
  public printBarcodeHeight80mm ='80'; 
  public printHeaderDelay =''; 
  public bankTerminalCOM ='';
  public barcodeLogin = false;
  public defaultLogin = "CustomCode";
  public slideshowDelay = "5000";
  public removeLineRoundingFixedPriceAddOrder = true; 
  // Whether or not to enable debug mode
  public enableDebug = true;

  constructor() {
  }
}
