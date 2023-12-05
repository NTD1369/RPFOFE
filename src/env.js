 

(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.host = 'http://rpfo-fe-qas.southeastasia.cloudapp.azure.com';
  window.__env.apiUrl = 'http://rpfo-be-qas.southeastasia.cloudapp.azure.com/api/';
  window.__env.apiMWIUrl = 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:9999/api/';
  window.__env.mwiToken = '6f59e16f523e4525b4278b5dbd61c624';
  window.__env.terminalID = '20000835';
  window.__env.merchantID = '302255';
  window.__env.printDelay = '100'; 
  window.__env.bankTerminalCOM = 'COM4';  
  window.__env.defaultLogin = 'User'; 
  window.__env.barcodeLogin = true; 
  window.__env.printBarcodeWidth50cm = '1.7'; 
  window.__env.printBarcodeHeight50mm = '70'; 
  window.__env.printBarcodeWidth80cm = '2'; 
  window.__env.printBarcodeHeight80mm = '80'; 
  window.__env.removeLineRoundingFixedPriceAddOrder = true; 

  // public printBarcodeWidth50mm ='1.2'; 
  // public printBarcodeHeight50mm ='80'; 
  // public printBarcodeWidth80mm ='2'; 
  // public printBarcodeHeight80mm ='80';
  // window.__env.mwiToken = '23fa139ade41469db4f6517853b9fb2b';
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = false;
}(this));
// terminalID: '20000835', 
// merchantID: '302255', 