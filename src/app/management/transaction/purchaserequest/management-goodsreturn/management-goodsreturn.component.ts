import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MCustomer } from 'src/app/_models/customer';
import { TGoodsReceiptPoheader, TGoodsReceiptPoline } from 'src/app/_models/grpo';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MUom } from 'src/app/_models/muom';
import { TPurchaseOrderHeader } from 'src/app/_models/purchase';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { MTax } from 'src/app/_models/tax';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { ShiftService } from 'src/app/_services/data/shift.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GoodsreturnService } from 'src/app/_services/transaction/goodsreturn.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-goodsreturn',
  templateUrl: './management-goodsreturn.component.html',
  styleUrls: ['./management-goodsreturn.component.scss']
})
export class ManagementGoodsReturnComponent implements OnInit {

  
  currentValue: Date = new Date();
  po: TPurchaseOrderHeader;
  goodsreturn: TGoodsReceiptPoheader;
  lines:TGoodsReceiptPoline[];
  itemList: any;
  taxList: MTax[];
  storageList: MStorage[];
  serialList: MItemSerial[];
  uomList: MUom[];
  mode: string;
  issueId: string;
  isNew = true;
  gridBoxValue: string[]=[];
  isActive = false;
  storeList: MStore[];
  customerList: MCustomer[];
  storeSelected: MStore;
  isEditGrid=false;
  constructor(private goodsreturnService: GoodsreturnService, private alertifyService: AlertifyService, private uomService: UomService, private storeService: StoreService, private shiftService: ShiftService,
    private taxService: TaxService, private storageService: StorageService, public itemUomService: ItemuomService,private customerService: CustomerService, private authService: AuthService,
     private itemService: ItemService,private route: ActivatedRoute, private router: Router) { 
      this.storeSelected = this.authService.storeSelected();
    this.loadItemList();
    this.loadTaxList();
    this.loadStorageList();
    this.loadUom();
    this.loadStore();
    this.loadCustomer();
    this.customizeText= this.customizeText.bind(this);
    
    // this.getFilteredUom = this.getFilteredUom.bind(this);
  }
  customizeText (e) {
    // debugger;
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  loadCustomer()
  {
    this.customerService.getByCompany(this.storeSelected.companyCode, "S").subscribe((response: any)=>{
      // this.customerList= response;
      if(response.success)
        {
          this.customerList = response.data;
        }
        else
        {
          this.alertifyService.warning(response.message)
        }
    });
  }
  loadStore()
  {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList = response.data;
         
      } 
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.storeList= response;
    });
    // this.storeService.getAll().subscribe((response: any)=>{
    //   this.storeList= response;
    // });
  }
 
  ngAfterViewInit() {
     
   
  } 
  onTaxSelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent): void {  
    // debugger; 
     console.log(e);
     cellInfo.setValue(selectedRowKeys[0]); 
    
      if(selectedRowKeys.length > 0) {
        dropDownBoxComponent.close(); 
        // let code =event.selectedRowsData[0].itemCode;
        // debugger;
        let price = this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price')
        let percent = event.selectedRowsData[0].taxPercent;
        
        let taxamt= price * percent / 100;
        let linetotal = price + taxamt;
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxAmt', taxamt);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxRate', percent);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'taxCode', selectedRowKeys[0]); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'lineTotal', linetotal); 
        // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
         
    }
  }  
  onItemSelectionChanged(selectedRowKeys, cellInfo,event, e, dropDownBoxComponent) {
    // debugger;
    // console.log(cellInfo);
    cellInfo.setValue(selectedRowKeys[0]); 
    if(selectedRowKeys.length > 0) {
        dropDownBoxComponent.close(); 
        let code =event.selectedRowsData[0].itemCode;
        let name = event.selectedRowsData[0].itemName;
        let uom= event.selectedRowsData[0].uomCode;
        let barcode= event.selectedRowsData[0].barCode;
        let price= event.selectedRowsData[0].defaultPrice;
        // // this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'keyId', selectedRowKeys[0]); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'itemCode', code); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'description', name);  
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'currencyCode', this.storeSelected.currencyCode); 
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'uomCode', uom);   
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'barCode', barcode);   
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'price', price);   
        this.dataGrid.instance.cellValue(cellInfo.rowIndex, 'quantity', '1');  
    }
    
  }
  validateNumber(e) {
    debugger;
    let quantity = e.data.quantity;
    let vl=e.value;
    return quantity>=vl;
  }
  onRowValidating(e) {
    debugger;
    if(e.newData.openQty) {
      if(e.newData.openQty > e.oldData.quantity)
      {
        e.errorText = 'Number lon qua';
        e.isValid = false;
      }
       
    }
  }
 
  onEditorPreparing(e) {
    // debugger;
    if(e.parentType === "dataRow" && e.dataField === "uomCode") {
        
        // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number");
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, e.row.data.itemCode).subscribe((response: any)=>{ 
          // this.uomList = response;
          if (response.success) {
            debugger;
            this.uomList = response.data;
          }
          else {
            this.alertifyService.error(response.message);
          }     
        })
    }
  }
  updateProductName(eventData, cellInfo: any) {
    
    if (cellInfo.setValue) {
      cellInfo.setValue(eventData.value);
    }
  }
 
  
  saveModel()
  {
    // if(this.isEditGrid===true)
    // {
    //   this.alertifyService.error("please complete edit data");
    // }
    // else
    // {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          if(this.isNew === true)
          {
            debugger;
            let docTotal: number =0;
            this.goodsreturn.lines.forEach((line)=>{
               line.baseEntry = this.po.docEntry;
               docTotal+= line.openQty * line.price;
               line.lineTotal = line.openQty * line.price;;
            });
            this.goodsreturn.docTotal = docTotal;
            this.goodsreturn.createdBy = this.authService.getCurrentInfor().username;
            // this.goodreceipt.totalReceipt= quantity;
            // this.goodreceipt.lines = this.lines;
            this.goodsreturn.status= 'C';
            this.goodsreturn.isCanceled= 'N';
            let shift = this.shiftService.getCurrentShip();
            if(shift!==null && shift!==undefined)
            {
              this.goodsreturn.shiftId = this.shiftService.getCurrentShip().shiftId; 
            }
            this.goodsreturnService.create(this.goodsreturn).subscribe((response: any)=>{
              if(response.success===true)
              {
                this.alertifyService.success("Create successfully completed. Trans Id: " + response.message);
                this.router.navigate(["admin/goodsreturn","edit", response.message,  this.goodsreturn.companyCode,  this.goodsreturn.storeId]);
                // this.router.navigate['goodissue'];
              }
              else
              {
                this.alertifyService.error(response.message);
              }
            });
          }
          else
          {
            debugger;
            let docTotal: number =0;
            this.goodsreturn.lines.forEach((line)=>{
               line.baseEntry = this.po.docEntry;
               docTotal+= line.openQty * line.price;
            })
            this.goodsreturn.docTotal = docTotal;
            this.goodsreturn.modifiedBy = this.authService.getCurrentInfor().username;
            this.goodsreturnService.create(this.goodsreturn).subscribe((response: any)=>{
              if(response.success===true)
              {
                this.alertifyService.success("Update successfully completed. Trans Id: " + response.message);
                this.router.navigate(["admin/goodsreturn","edit", response.message,  this.goodsreturn.companyCode,  this.goodsreturn.storeId]);
              }
              else
              {
                this.alertifyService.error(response.message);
              }
            });
          }
        }});
    // }
    
  }
  dataSourceItem: any;
  ngOnInit() {
    // debugger;
    this.dateFormat = this.authService.loadFormat().dateFormat;
    this.route.data.subscribe(data => {
      this.po = data['purchase'];
    });
    this.goodsreturn = this.goodsreturnService.mapPO2GRPO(this.po);
    console.log(this.goodsreturn.lines);
  }
  
  @ViewChild('dataGrid' , { static: false}) dataGrid;  
  @ViewChild('gridBox') gridBox;  
  @ViewChild('gridTaxBox') gridTaxBox;  
  @ViewChild('gridUoMBox' , { static: false}) gridUoMBox;  
  @ViewChild('dropDownUoM') dropDownUoM;  
  taxAmtCellValue(rowData)
  {
    
    if(rowData.quantity !== undefined && rowData.price !== undefined)
    {
      // debugger;
      let amount = rowData.quantity * rowData.price;
      if(amount !== null && amount !== undefined  )
      {
        let taxpercent = rowData.taxRate;
         
        return amount * taxpercent / 100; 
      }
    }
    
    return 0; 
  }
  dateFormat="";
  onRowPrepared(e) {  
     
    if(e.data!==null && e.data!==undefined)
    {
      
      if(e.data.keyId!==null && e.data.keyId!==undefined  &&  e.data.lineId!==null && e.data.lineId!==undefined )
      {
        if (e.rowType === "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
          // debugger;
          if(e.rowElement.querySelector(".dx-command-expand")!==null && e.rowElement.querySelector(".dx-command-expand")!==undefined)
          {
            e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
            e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  
      
          }
         
        }  
      }
      
    }
    // if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
      
    //   e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
    //   e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  

    // }  
}  
  lineTotalCellValue(rowData)
  {
   
    if(rowData.openQty !== null && rowData.price !== null)
    {
      return rowData.openQty * rowData.price; 
    }
    return 0; 
  }
  getFilteredUom(options): any {
    // debugger;
    
    // console.log('options: ' + options);
    if(options!== null && options !== undefined)
    {
      if(options.data !== undefined && options.data !== null)
      {
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, options.data.itemCode).subscribe((response: any)=>{
          // debugger; 
          // this.itemUom = response;
          if (response.success) {
            debugger;
            this.itemUom = response.data;
          }
          else {
            this.alertifyService.error(response.message);
          }  
        });
      }
      
    }
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      debugger;
      // return response;
      if(response.success)
      {
        this.itemUom = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.itemUom = response;
    });
   
  }
   onUoMSelectionChanged(e: any, data: any){
    // console.log(e);
    // debugger;
    if(e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined)
    {
      let itemCode = data.data.itemCode;
      let uomCode = e.selectedRowsData[0].uomCode;
      
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{ 
        // this.itemUom = response; 
        // debugger;
        if (response.success) {
          debugger;
          this.itemUom = response.data;
          if( this.itemUom === null ||  this.itemUom === undefined)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
          }
          else{
            let itemuom = this.itemUom.find(x=>x.uomCode === uomCode);
            // debugger;
            if(itemuom !== null && itemuom !== undefined)
            {
              this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);  
              
            }
            else
            {
              this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', '');
            }
          }
        }
        else {
          this.alertifyService.error(response.message);
        }  
      
     
        
      }) 
      
    }
    
  }
  isDropDownBoxOpened(e , data)
  {
    // debugger;
    // console.log(data.itemCode);
    setTimeout(() => {
      this.loadUomNew(data.itemCode)
    },2); 
    return true;
  }
  loadUomNew(itemCode)
  {
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{ 
      // this.itemUom = response; 
      if (response.success) {
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }  
    })
  }
  onSelectionChanged(e: any, data: any): void {  
    // debugger;  console.log(e);
      // console.log(e.selectedRowsData);
      let itemCode = e.selectedRowsData[0].itemCode;
      // this.dataGrid.instance.cellValue(data.rowIndex, 'itemCode', itemCode);  
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
        // debugger;
        if (response.success) {
          debugger;
          this.itemUom = response.data;
          // this.itemUom = response;
        
          // console.log(this.itemList); 
          // console.log(this.itemUom);
  
          let price =e.selectedRowsData[0].defaultPrice;
          this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);  
          let uom = e.selectedRowsData[0].inventoryUom;
          this.dataGrid.instance.cellValue(data.rowIndex, 'uomCode', uom);   
          let itemuom = this.itemUom.find(x=>x.itemCode === itemCode && x.uomcode === uom);
        
          if(itemuom !== null && itemuom !== undefined)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);  
          }
          let tax = e.selectedRowsData[0].goodsreturnTaxCode;
          this.dataGrid.instance.cellValue(data.rowIndex, 'quantity', 1);  
          let taxamt= 0;
          if(tax !== '' && tax !== undefined && tax !== null)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'taxCode', tax);   
            let taxvalue = this.taxList.find(x=>x.taxCode === tax);
            if(taxvalue!== null && taxvalue !== undefined)
            {
              this.dataGrid.instance.cellValue(data.rowIndex, 'taxRate', taxvalue.taxPercent);  
            } 
            let taxSelected = this.taxList.filter(x=>x.taxCode === tax)[0];
            let percent = taxSelected.taxPercent;
            taxamt= price * percent/ 100;
            this.dataGrid.instance.cellValue(data.rowIndex, 'taxAmt', taxamt);  
          }
          // let uom = e.selectedRowsData[0].inventoryUom;
          this.dataGrid.instance.cellValue(data.rowIndex, 'currencyCode', this.storeSelected.currencyCode);  
          
          let linetotal = price + taxamt;
          this.dataGrid.instance.cellValue(data.rowIndex, 'lineTotal', linetotal); 
          // setTimeout(() => {  
          //   this.dataGrid.instance.repaintRows([data.rowIndex]);  
          // }, 200);  
          this.gridBox.instance.close();  
        }
        else {
          this.alertifyService.error(response.message);
        }  
       
      });
  

  }  
  
  priceColumn_customizeText (cellInfo) {
    // debugger;
    return cellInfo.value + "$";
  }
  
   
  loadItemList()
  {
    this.itemService.GetItemInforList(this.storeSelected.companyCode,this.storeSelected.storeId,'','','','','').subscribe((response: any)=>{
      this.itemList = response.data;
      debugger;
    });
    
  }
  itemUom: any;
  loadItemUom(itemCode)
  {
     
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
      // debugger;
      // this.itemUom = response;
      if (response.success) {
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
      // console.log(this.itemList);
    });
  }
  loadUom()
  {
     
    this.uomService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.uomList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.uomList = response;
      // console.log(this.uomList);
    });
  }
  
  loadTaxList()
  {
    
    this.taxService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.taxList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.taxList = response;
      // console.log(this.taxList);
    });
  }
  loadStorageList()
  {
    
    this.storageService.getByStore(this.storeSelected.storeId, this.storeSelected.companyCode).subscribe((response: any)=>{
      // debugger;
      if(response.success)
      {
        this.storageList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // this.storageList = response;
      // console.log(this.storageList);
    });
  }


}
