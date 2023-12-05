import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { Order } from 'src/app/_models/viewmodel/order';
import { AuthService } from 'src/app/_services/auth.service';
import { BillService } from 'src/app/_services/data/bill.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { MStore } from 'src/app/_models/store';
import { DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/_services/common/loading.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
export class IPermission {
  controlId: string;
  permission: string;
  result: boolean;
}
enum LoadingIndicator {
  OPERATOR,
  MANUAL,
  ASYNC_PIPE
}

@Component({
  selector: 'app-shop-another-source-bill',
  templateUrl: './shop-another-source-bill.component.html',
  styleUrls: ['./shop-another-source-bill.component.css'],
  providers: [
    DatePipe
  ],
})
export class ShopAnotherSourceBillComponent implements OnInit {

  minWidthAction= 150;
  bills: TSalesHeader[]; 
  userParams: any = {};
  totalBill=0;
  exchangeBill=0;
  holdBill=0;
  returnBill=0;
  cancelBill=0;
  closedBill=0; 
  saveBill:any=[];
  statusOptions: any = [
    { name: 'All', value:''},
    { name: 'Closed', value:'C'},
    { name: 'Canceled', value:'N'},
    { name: 'Hold', value:'H'},
    { name: 'Open', value:'O'},
    // { name: 'Exchange', value:'Ex'},
    // { name: 'Return', value:'R'},
  ];
  fromdate ="";
  todate="";
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }

  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'EcomBill' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
    
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') + '_' + this.authService.getCurrentInfor().username;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        // customizeCell: function(options) {
        //     const excelCell = options;
        //     excelCell.font = { name: 'Arial', size: 12 };
        //     excelCell.alignment = { horizontal: 'left' };
        // } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }

  
  filterbills(type)
  {
    debugger;
    this.bills = this.saveBill;
    if(type==="All")
    {
      this.bills = this.saveBill;
    }
    if(type==="C")
    {
      this.bills = this.bills.filter(x=>x.status==='Closed'  );
    }
    if(type==="N")
    {
      this.bills =this.bills.filter(x=>x.status==='Canceled');
    }
    if(type==="H")
    {
      this.bills =this.bills.filter(x=>x.status==='Hold');
    }
    if(type==="Ex")
    {
      this.bills =this.bills.filter(x=>x.salesMode.toLowerCase()==='ex' || x.salesMode.toLowerCase()==='exchange' || x.salesMode.toLowerCase()==='return');
    }
    if(type==="R")
    {
      this.bills =this.bills.filter(x=>x.salesMode.toLowerCase()==='return');
    }
   
  }
  
  constructor(private billService: BillService, private alertify: AlertifyService, public loadingService: LoadingService ,private controlService: ControlService, private routeNav: Router, private authService: AuthService, public datepipe: DatePipe,
              private route: ActivatedRoute) { 
                this.customizeText= this.customizeText.bind(this);
                
              }
    customizeText (e) {
      // debugger;
        if( e.value!==null &&  e.value!== undefined)
        {
          return this.authService.formatCurrentcy( e.value);
  
        }
        return 0;
    };
  ngAfterViewInit()
  {
    debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.add('hide');
          // console.log('ecom');
        }
    });
    // paymentMenu
  
  }
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
        location: 'before',
        template: 'totalGroupCount'
    }, {
            location: 'before',
            widget: 'dxSelectBox',
            options: {
                width: 200,
                items: [{
                    value: 'POS',
                    text: 'POS'
                }, {
                    value: '',
                    text: 'Others'
                }],
                displayExpr: 'text',
                valueExpr: 'value',
                value: 'dataSource',
                onValueChanged: this.groupChanged.bind(this)
            } 
        });
  }
  totalCount: number;
  groupChanged(e) {
    // this.dataGrid.instance.clearGrouping();
    // this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
    // this.totalCount = this.getGroupCount(e.value);
    debugger;
    this.dataGrid.instance.columnOption('dataSource', "=", e.value);
  }
  // getGroupCount(groupField) {
  //   debugger;
  //   let abc= query(this.bills)
  //   .groupBy(groupField)
  //   .toArray().length;
  //     return abc;
  // }
  expanded = true;
  // routerLink="printOrder(cell.data)/shop/bills/print/{{}}/:companycode/:storeid">
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  storeSelected: MStore;
  dateFormat="";
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    let now = new Date();
    let from= now.setDate(now.getDate() - 30 ); 
    this.fromdate = this.datepipe.transform(from, 'yyyy-MM-dd');
    this.todate =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
     this.storeSelected= this.authService.storeSelected();
     this.loadControl();
    // this.route
    // this.loadItems();
    // debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.bills = data['bills'];//.result;
    //   // this.totalCount = this.getGroupCount('dataSource');
    //   console.log(this.bills);
    // //   this.pagination = data['bills'].pagination;
    // //   // debugger;
    // //   this.userParams.status = ''; 
    // // this.userParams.keyword = ''; 
    // // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    this.loadBills('','','','','','');
  }
  permissionDic: IPermission[]=[];
  checkPermission(controlId: string, permission: string): boolean
  { 
    // debugger;
    let result=false;
    let re= this.permissionDic.find(x=>x.controlId===controlId && x.permission===permission);
    if(re===null || re===undefined)
    {
      let rs= this.authService.checkRole(this.functionId , controlId, permission );
      let per=  new IPermission();
      per.controlId= controlId;
      per.permission = permission;
      per.result = rs; 
      this.permissionDic.push(per);
      result=true;
    }
    else
    {
      result=re.result;
    }
    
    return result;
  }
  loadBills(from, to , status, type, transId, keyword)
  { 
      let now = new Date();
      if(from===null || from ===undefined || from==="")
      { 
          from = now.setDate(now.getDate() - 60 ); 
      }
      if(to===null || to ===undefined || to==="")
      { 
        to = new Date();
      }
      if(status!==null && status!==undefined)
      {
        if(status=='C')
        {
          status = 'C';
        }
        if(status=='N')
        {
          // status = 'C';
        }
        if(status=='Ex')
        {
          
        }
        if(status=='R')
        {
          
        }
         
      }
      debugger;
      this.billService.getByType(this.storeSelected.companyCode, this.storeSelected.storeId, '', 
        this.datepipe.transform(from, 'yyyy-MM-dd'),  this.datepipe.transform(to, 'yyyy-MM-dd'), 'Ecom', transId,status,'', keyword, this.authService.getCurrentInfor().username).subscribe(
        (response: any)=>{
        if(response.success)
        {
          debugger;
          this.bills = response.data;//.result;
          this.totalBill = this.bills.length;
          this.cancelBill = this.bills.filter(x=>x.status==='Canceled').length;
          this.closedBill = this.bills.filter(x=>x.status==='Closed').length;
          this.exchangeBill = this.bills.filter(x=>x.salesMode.toLowerCase()==='ex' || x.salesMode.toLowerCase()==='exchange').length;
          this.returnBill = this.bills.filter(x=>x.salesMode.toLowerCase()==='return').length;
          this.holdBill = this.bills.filter(x=>x.status==='Hold').length;
          this.saveBill = this.bills;
        }
        else{
          this.alertify.warning(response.message);
        }
      })
  }
   
  buttonList=[];
  functionId = "Adm_OnlineList";
  marked = false;
  controlList: any[];
  loadControl()
  {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
      if(response.data.length > 0)
      {
      //  debugger;
       this.controlList= response.data.filter(x=>x.custom2!=='button' && x.controlType === 'GridColumn') ;
     
       this.buttonList = response.data.filter(x=>x.custom2==='button') ;
       this.controlList= this.controlList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
       this.buttonList= this.buttonList.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
       console.log(this.controlList);  
      }
     });
  }
  OpenOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
    //  this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);

     window.open('shop/bills/' +  order.transId +'/'+ order.companyCode+'/'+order.storeId, "_blank");
  }
  // PrintOrder(order)
  // {
  //   //  /shop/bills/print//:companycode/:storeid
  //    this.routeNav.navigate(["shop/bills/print", order.transId, order.companyCode, order.storeId]);
  // }
  CheckOutOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills/checkout", order.transId, order.companyCode, order.storeId]);
  }
  ConfirmOrder(order: Order)
  {

  }
  CheckInOrder(order: Order)
  {
    debugger;
    // ['MyCompB', {id: "someId", id2: "another ID"}]
     this.routeNav.navigate(["shop/bills/checkin", order.transId, order.companyCode, order.storeId]);
  }
  // ReturnOrder(order: Order)
  // {
  //   debugger;
  //   // ['MyCompB', {id: "someId", id2: "another ID"}]
  //    this.routeNav.navigate(["shop/bills/return", order.transId, order.companyCode, order.storeId]);
  // }
}
