// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const loyalty = {
  lineType: [
    { name: 'Barcode', value:'BarCode'},
    { name: 'Item Code', value:'ItemCode'},
    { name: 'Item Group', value:'ItemGroup'},
    { name: 'Collection', value:'Collection'}, 
  ], 

}
export const promotion = {
  valueCardType:[
    { name: 'Bonus Amount', value:'Bonus Amount'},
    { name: 'Bonus Percent', value:'Bonus Percent'},
  ],
  valueType: [
    { name: 'Discount Amount', value:'Discount Amount'},
    { name: 'Discount Percent', value:'Discount Percent'},
    { name: 'Fixed Price', value:'Fixed Price'},
    { name: 'Fixed Quantity', value:'Fixed Quantity'},
   
  ],
  mixMatchvalueType: [
    { name: 'Discount Amount', value:'Discount Amount'},
    { name: 'Discount Percent', value:'Discount Percent'},
    { name: 'Fixed Price', value:'Fixed Price'}, 
    { name: 'Fixed Quantity', value:'Fixed Quantity'}, 
  ],
  loyaltyValueType: [
  
    { name: 'Fixed Point', value:'Fixed Point'},
    { name: 'Percent Amount', value:'Percent Amount'},
   
  ],
  valuePayment: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' }, 
  ],
  valueSingleType: [
    { name: 'Discount Amount', value:'Discount Amount'},
    { name: 'Discount Percent', value:'Discount Percent'},
    { name: 'Fixed Price', value:'Fixed Price'}, 
   
  ],
  totalGetType: [
    { name: 'Discount Amount', value:'Discount Amount'},
    { name: 'Discount Percent', value:'Discount Percent'},
    
  ],
  totalGetLoyaltyType: [
    { name: 'Fixed Point', value:'Fixed Point'},
    { name: 'Percent Amount', value:'Percent Amount'},
    
  ],

  lineType: [
    { name: 'Barcode', value:'BarCode'},
    { name: 'Item Code', value:'ItemCode'},
    { name: 'Item Group', value:'ItemGroup'},
    { name: 'Collection', value:'Collection'},
    { name: 'One Time Group', value:'OneTimeGroup'},
  ], 
  lineTypePayment: [
    { name: 'Payment Code', value:'PaymentCode'},
    { name: 'Payment Type', value:'PaymentType'},
   
  ], 
  lineTypeCombo: [
    { name: 'Barcode', value:'BarCode'},
    { name: 'Item Code', value:'ItemCode'} ,
    { name: 'Collection', value: 'Collection' },
    { name: 'One Time Group', value: 'OneTimeGroup' },
  ], 
  conditionType: [
    { name: 'Amount', value:'Amount'},
    { name: 'Quantity', value:'Quantity'},
    // { name: 'Accumulated', value:'Accumulated'}, 
  ], 
  conditionTypePayment: [
    { name: 'Amount', value:'Amount'}, 
  ], 
  condition1Type: [
    { name: 'Equal', value:'CE'},
    { name: 'From', value:'FROM'}, 
  ],
  
  condition2Type: [
    { name: '', value:''},
    { name: 'To', value:'TO'}, 
  ]

}
export const status = {
  active: [
    { name: 'Active', value:'A'},
    { name: 'Inactive', value:'I'}
  ], 
  InventoryDocument: [
    // {
    //   value: "O", name: "Open",
    // },
    {
      value: "C", name: "Closed",
    }, 
    {
      value: "N", name: "Cancel",
    }, 
  ],
  InventoryDocumentAdvance: [
    // {
    //   value: "O", name: "Open",
    // },
    {
      value: "C", name: "Closed",
    }, 
    {
      value: "P", name: "Partial",
    } ,
    {
      value: "N", name: "Cancel",
    }, 
  ]
} 
export const environment = {
  production: false,
  host:'http://localhost:4200',
 

//VietWash
// apiUrl:'http://192.168.1.45:8888/',
// apiMWIUrl: 'http://192.168.1.45:8090/',


  // apiUrl: 'https://pos-api.jumparena.vn:8443/api/',
  // apiMWIUrl: 'https://mwi-api.jumparena.vn:443/api/',


    // host:'http://rpfo-fe.southeastasia.cloudapp.azure.com',
  // apiUrl: 'http://rpfo-be.southeastasia.cloudapp.azure.com/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8443/api/', 


  // apiUrl: 'https://pos-api.jumparena.vn:8555/api/',
  // apiMWIUrl: 'https://mwi-api.jumparena.vn:55620/api/', 
  appVersion: require('../../package.json').version + '-dev',
 
  apiUrl: 'http://localhost:5000/api/', 
  
  // terminalID: '20000835', 
  // merchantID: '302255', 
  bankTerminalCOM: 'COM4', 
  printDelay: '100',  
 
  barcodeLogin: false, 
  // farmer
  // apiUrl: 'https://118.69.84.39:8888/api/',
  // apiUrl: 'http://sapvn.com:7998/api/', 
  apiMWIUrl: 'https://wmi.farmersmarket.vn:8080/api/',
  // apiUrl: 'https://pos.farmersmarket.vn:8888/api/',
  
  // apiUrl: 'https://pos.farmersmarket.vn:8901/api/',
  // apiMWIUrl: 'https://wmi.farmersmarket.vn:8081/api/',

  mwiToken: '6f59e16f523e4525b4278b5dbd61c624',
  // mwiToken: '23fa139ade41469db4f6517853b9fb2b',
  // apiUrl: 'http://rpfo-be.southeastasia.cloudapp.azure.com/api/',
  // apiUrl: 'http://sapvn.com:7998/api/',
  // apiMWIUrl: 'http://13.250.45.22:55620/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8443/api/',
  // apiMWIUrl: 'https://wmi.farmersmarket.vn:8080/api/',
 

  // host:'http://rpfo-fe-qas.southeastasia.cloudapp.azure.com',
  // apiUrl: 'http://rpfo-be-qas.southeastasia.cloudapp.azure.com/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8888/api/', 
  // apiMWIUrl: 'http://192.168.1.45:8090/api/',
  
  // apiUrl: 'http://sapvn.com:5010/api/',
  // apiMWIUrl: 'http://localhost:44347/api/',
  // apiMWIUrl: 'https://mwi-api.jumparena.vn:55620/api/',
  // apiMWIUrl: 'http://sapvn.com:50895/api/',
  // apiMWIUrl: 'http://115.165.166.144:33620/api/',
  // apiUrl: 'https://pos-api.jumparena.vn:8443/api/',
  imageUrl:  "wwwroot/images/items/",
  // imageUrlCompany:  "http://localhost:5000//images/items/",
};
// apiMWIUrl: 'http://13.250.45.22:55620/api/',
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
