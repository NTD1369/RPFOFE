import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MCustomer } from 'src/app/_models/customer';
import { TGoodsReceiptPoheader, TGoodsReceiptPoline } from 'src/app/_models/grpo';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { MUom } from 'src/app/_models/muom';
import { MStorage } from 'src/app/_models/storage';
import { MStore } from 'src/app/_models/store';
import { MTax } from 'src/app/_models/tax';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomerService } from 'src/app/_services/data/customer.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { ItemuomService } from 'src/app/_services/data/itemuom.service';
import { StorageService } from 'src/app/_services/data/storage.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { TaxService } from 'src/app/_services/data/tax.service';
import { UomService } from 'src/app/_services/data/uom.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { GrpoService } from 'src/app/_services/transaction/grpo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-print-grpo',
  templateUrl: './management-print-grpo.component.html',
  styleUrls: ['./management-print-grpo.component.scss']
})
export class ManagementPrintGrpoComponent implements OnInit {

  currentValue: Date = new Date();
  grpo: TGoodsReceiptPoheader;
  lines:TGoodsReceiptPoline[];
  itemList: any;
  taxList: MTax[];
  storageList: MStorage[];
  serialList: MItemSerial[];
  uomList: MUom[];
  mode: string;
  issueId: string;
  isNew = false;
  gridBoxValue: string[]=[];
  isActive = false;
  storeList: MStore[];
  customerList: MCustomer[];
  storeSelected:MStore;
  
  statusOptions = [
    {
      value: "O", name: "Open",
    },
    {
      value: "C", name: "Closed",
    },

  ];
  constructor(private authService: AuthService, private grpoService: GrpoService, private alertifyService: AlertifyService, private uomService: UomService, private storeService: StoreService,
    private taxService: TaxService, private storageService: StorageService, public itemUomService: ItemuomService,private customerService: CustomerService,
     private itemService: ItemService,private route: ActivatedRoute, private router: Router) { 
      this.storeSelected= this.authService.storeSelected();
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
    debugger;
     if( e.value!==null &&  e.value!== undefined)
     {
       return this.authService.formatCurrentcy( e.value);

     }
     return 0;
  };
  loadCustomer()
  {
    this.customerService.getByCompany(this.storeSelected.companyCode, "S").subscribe((response: any)=>{
      if(response.success)
        {
          this.customerList = response.data;
        }
        else
        {
          this.alertifyService.warning(response.message)
        }
      // this.customerList= response;
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
        debugger;
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
    debugger;
    console.log(cellInfo);
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
  onEditorPreparing(e) {
    debugger;
    if(e.parentType === "dataRow" && e.dataField === "uomCode") {
        
        // e.editorOptions.disabled = (typeof e.row.data.itemCode !== "number");
        this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode,e.row.data.itemCode).subscribe((response: any)=>{ 
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
    
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          let doctotal: number =0;
          let vatPercent: number =0;
          let vatTotal: number =0;
          debugger;
          this.lines.forEach((item)=>{
           
            if(item.lineTotal!==null && item.lineTotal!==undefined) 
            {
              vatPercent+= parseInt(item.vatPercent.toString());
            }
            
            if(item.lineTotal!==null && item.lineTotal!==undefined)  
            {
              doctotal+= parseInt(item.lineTotal.toString());
            }
            else
            {
              item.lineTotal = item.quantity * item.price;
              doctotal+= parseInt(item.lineTotal.toString());
            }
            if(item.lineTotal!==null && item.lineTotal!==undefined && item.vatPercent!==null && item.vatPercent!==undefined)  
              vatTotal+= parseInt(item.vatPercent.toString())* parseInt(item.lineTotal.toString());
           
          })
      
          // this.goodreceipt.createdBy = '';
          this.grpo.docTotal= vatPercent;
          this.grpo.docTotal= vatTotal;
          this.grpo.docTotal= doctotal;
          this.grpo.lines = this.lines;
        
          this.grpo.isCanceled= 'N';
          this.grpo.storeId = this.storeSelected.storeId;
          this.grpo.storeName = this.storeSelected.storeName;
          this.grpo.companyCode = this.storeSelected.companyCode;
          if(this.isNew === true)
          {
            this.grpo.status= 'C';
            this.grpo.createdBy= this.authService.getCurrentInfor().username;
            this.grpoService.create(this.grpo).subscribe((response: any)=>{
              if(response.success===true)
              {
                this.alertifyService.success("save successfully completed. Trans Id: " + response.message);
                this.router.navigate['/admin/grpo'];
              }
              else
              {
                this.alertifyService.error(response.message);
              }
            });
          }
          else
          {
            this.grpo.status= 'C';
            this.grpo.modifiedBy= this.authService.getCurrentInfor().username;
            this.grpoService.create(this.grpo).subscribe((response: any)=>{
              if(response.success===true)
              {
                this.alertifyService.success("save successfully completed. Trans Id: " + response.message);
              }
              else
              {
                this.alertifyService.error(response.message);
              }
            });
          } 
        } 
        else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      })
     
    
   
  }
  dataSourceItem: any;
  dateFormat="";
  ngOnInit() {
    this.dateFormat = this.authService.loadFormat().dateFormat;
    debugger;
  
    this.route.params.subscribe(data => { 
      this.issueId = data['id'];
    })
     
    this.grpoService.getBill(this.issueId, this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any)=>{
      debugger;
      if(response.success)
      {
        this.grpo = response.data; 
        this.lines = response.data.lines; 
      }
      else
      {
        this.alertifyService.warning(response.message);
        this.router.navigate['/admin/grpo'];
      }
      
      
      // this.getFilteredUom = this.getFilteredUom.bind(this.lines);
      this.isNew= false;
    });
    
    
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
  onRowPrepared(e) {  
     
    if (e.rowType == "data" && (e.data.lines===null || e.data.lines===undefined || e.data.lines.length===0 || e.data.lines==='undefined'))  {  
      
      e.rowElement.querySelector(".dx-command-expand").firstChild.classList.remove("dx-datagrid-group-closed");  
      e.rowElement.querySelector(".dx-command-expand").classList.remove("dx-datagrid-expand");  

    }  
}  
  lineTotalCellValue(rowData)
  {
   
    if(rowData.quantity !== null && rowData.price !== null)
    {
      return rowData.quantity * rowData.price; 
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
      if(response.success)
      {
        this.itemUom = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
      // return response;
      // this.itemUom = response;
    });
   
  }
   onUoMSelectionChanged(e: any, data: any){
    console.log(e);
    debugger;
    if(e.selectedRowsData[0] !== null && e.selectedRowsData[0] !== undefined)
    {
      let itemCode = data.data.itemCode;
      let uomCode = e.selectedRowsData[0].uomCode;
      
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{ 
        if (response.success) {
          debugger;
          this.itemUom = response.data;
        //   this.itemUom = response; 
        // debugger;
        // //
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
      console.log(e.selectedRowsData);
      let itemCode = e.selectedRowsData[0].itemCode;
      // this.dataGrid.instance.cellValue(data.rowIndex, 'itemCode', itemCode);  
      this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
        debugger;
        if (response.success) {
          debugger;
          this.itemUom = response.data;
          
          let price =e.selectedRowsData[0].defaultPrice;
          this.dataGrid.instance.cellValue(data.rowIndex, 'price', price);  
          let uom = e.selectedRowsData[0].inventoryUom;
          this.dataGrid.instance.cellValue(data.rowIndex, 'uomCode', uom);   
          let itemuom = this.itemUom.find(x=>x.itemCode === itemCode && x.uomcode === uom);
        
          if(itemuom !== null && itemuom !== undefined)
          {
            this.dataGrid.instance.cellValue(data.rowIndex, 'barCode', itemuom.barCode);  
          }
          let tax = e.selectedRowsData[0].grpoTaxCode;
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
        // this.itemUom = response;
        
        // console.log(this.itemList); 
        // console.log(this.itemUom);

      });
  

  }  
  
  priceColumn_customizeText (cellInfo) {
    // debugger;
    return cellInfo.value + "$";
  }
  
   
  loadItemList()
  {
    this.itemService.getItemViewList(this.storeSelected.companyCode,this.storeSelected.storeId,'','','','','','').subscribe((response: any)=>{
      this.itemList = response.data;
      // debugger;
    });
     
  }
  itemUom: any;
  loadItemUom(itemCode)
  {
     
    this.itemUomService.getByItem(this.authService.getCurrentInfor().companyCode, itemCode).subscribe((response: any)=>{
      // debugger;
      if (response.success) {
        debugger;
        this.itemUom = response.data;
      }
      else {
        this.alertifyService.error(response.message);
      }
      // this.itemUom = response;
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
