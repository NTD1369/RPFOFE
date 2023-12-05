export const loyalty = {
  lineType: [
    { name: 'Barcode', value:'BarCode'},
    { name: 'Item Code', value:'ItemCode'},
    { name: 'Item Group', value:'ItemGroup'},
    { name: 'Collection', value:'Collection'}, 
  ], 

}
export const promotion = {
  valueCardType: [
    { name: 'Bonus Amount', value: 'Bonus Amount' },
    { name: 'Bonus Percent', value: 'Bonus Percent' },
  ],
  valueType: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' },
    { name: 'Fixed Price', value: 'Fixed Price' },
    { name: 'Fixed Quantity', value: 'Fixed Quantity' },

  ],
  mixMatchvalueType: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' },
    { name: 'Fixed Price', value: 'Fixed Price' },
    { name: 'Fixed Quantity', value: 'Fixed Quantity' },
  ],
  valueSingleType: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' },
    { name: 'Fixed Price', value: 'Fixed Price' },
  ],
  valuePayment: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' }, 
  ],
  totalGetType: [
    { name: 'Discount Amount', value: 'Discount Amount' },
    { name: 'Discount Percent', value: 'Discount Percent' },

  ],
  loyaltyValueType: [
    { name: 'Fixed Point', value: 'Fixed Point' },
    { name: 'Percent Amount', value: 'Percent Amount' },
  ],
  totalGetLoyaltyType: [
    { name: 'Fixed Point', value: 'Fixed Point' },
    { name: 'Percent Amount', value: 'Percent Amount' },
  ],
  lineType: [
    { name: 'Barcode', value: 'BarCode' },
    { name: 'Item Code', value: 'ItemCode' },
    { name: 'Item Group', value: 'ItemGroup' },
    { name: 'Collection', value: 'Collection' },
    { name: 'One Time Group', value: 'OneTimeGroup' },
  ],
  lineTypePayment: [
    { name: 'Payment Code', value:'PaymentCode'},
    { name: 'Payment Type', value:'PaymentType'}, 
  ], 
  lineTypeCombo: [
    { name: 'Barcode', value: 'BarCode' },
    { name: 'Item Code', value: 'ItemCode' },
    { name: 'Collection', value: 'Collection' },
    { name: 'One Time Group', value: 'OneTimeGroup' },
  ],
  conditionTypePayment: [
    { name: 'Amount', value:'Amount'}, 
  ], 
  conditionType: [
    { name: 'Amount', value: 'Amount' },
    { name: 'Quantity', value: 'Quantity' },
    // { name: 'Accumulated', value:'Accumulated'}, 
  ],
  condition1Type: [
    { name: 'Equal', value: 'CE' },
    { name: 'From', value: 'FROM' },
  ],
  condition2Type: [
    { name: '', value: '' },
    { name: 'To', value: 'TO' },
  ]

}

export const status = {
  active: [
    { name: 'Active', value: 'A' },
    { name: 'Inactive', value: 'I' }
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
    },
    {
      value: "N", name: "Cancel",
    },
  ]
}

export const environment = {


  production: true, 
  //  host:'http://servay-lb-rpfo-web-791914605.ap-southeast-1.elb.amazonaws.com',
  // host: 'http://sapvn.com:7999',
  // host:'http://20.197.118.97',
  // apiUrl: 'https://pos-api.jumparena.vn:8443/api/',
  // apiMWIUrl: 'https://mwi-api.jumparena.vn:33620/api/',

  // apiUrl: 'http://13.250.45.22:5050/api/',
  // apiUrl: 'http://servay-lb-rpfo-api-1956291476.ap-southeast-1.elb.amazonaws.com/api/',
  //  apiUrl: 'https://52.221.218.114:8443/api/',
  // //  apiUrl: 'http://sapvn.com:7998/api/',

  // apiUrl: 'http://20.43.168.126/api/',
  //  apiMWIUrl: 'http://13.250.45.22:55620/api/',
  //  apiMWIUrl: 'http://localhost:52373/api/',
  //  apiMWIUrl: 'https://54.254.202.237:33620/api/',

  //  apiMWIUrl: 'http://115.165.166.144:33620/api/',

  host: '',
  apiUrl: '',
  apiMWIUrl: '',
  mwiToken: '',
  terminalID: '', 
  merchantID: '',  
  bankTerminalCOM: '', 
  barcodeLogin: false, 
  printDelay: '', 
  appVersion: require('../../package.json').version,


  //Sap 4300
  // host: 'http://sapvn.com:4300',
  // apiUrl: 'http://sapvn.com:5010/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8888/api/',
  //Servay
  // host:'http://rpfo-fe.southeastasia.cloudapp.azure.com',
  // apiUrl: 'http://rpfo-be.southeastasia.cloudapp.azure.com/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8888/api/', 
  
  //Servay QAS
  // host:'http://rpfo-fe-qas.southeastasia.cloudapp.azure.com',
  // apiUrl: 'http://rpfo-be-qas.southeastasia.cloudapp.azure.com/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:9999/api/', 

  //Servay PRD
  // host:'http://rpfo-fe.southeastasia.cloudapp.azure.com',
  // apiUrl: 'http://rpfo-be.southeastasia.cloudapp.azure.com/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8443/api/', 

  // Jump
  // host:'https://pos.jumparena.vn',
  // apiUrl: 'https://pos-api.jumparena.vn:8555/api/',
  // apiMWIUrl: 'https://pos.jumparena.vn:443/api/',

//   host: 'https://pos.jumparena.vn',
// apiUrl: 'https://pos-api.jumparena.vn:8555/api/',
// apiMWIUrl: 'https://mwi-api.jumparena.vn:443/api/',

  // FARMER
  // host: 'https://118.69.84.39:8887',
  // apiUrl: 'https://118.69.84.39:8888/api/',
  // apiMWIUrl: 'https://118.69.84.39:8080/api/',

  // host: 'http://sapvn.com:7999',
  // apiUrl: 'http://sapvn.com:7998/api/',
  // apiMWIUrl: 'https://wmi.farmersmarket.vn:8080/api/',

  // Outlet 1
  // host: 'http://192.168.0.250, http://sekv-3006',
  // apiUrl: 'http://192.168.0.250:8443/api/',
  // // apiMWIUrl: 'https://192.168.0.250:8888/api/',
  // apiMWIUrl: 'http://rpfo-mwi.southeastasia.cloudapp.azure.com:8443/api/',


  imageUrl: "wwwroot/images/items/",
  imageUrlCompany:  "http://localhost:5000//images/items/",
};
