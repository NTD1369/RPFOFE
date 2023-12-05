import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { load } from '@fingerprintjs/fingerprintjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { ItemSearch } from 'src/app/shop/components/shop-search-item/shop-search-item.component';
 
import { Item } from 'src/app/_models/item';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-item-store-listing',
  templateUrl: './management-item-store-listing.component.html',
  styleUrls: ['./management-item-store-listing.component.css']
})
export class ManagementItemStoreListingComponent implements OnInit {


  items: ItemViewModel[];
  pagination: Pagination;
  userParams: any = {};
  functionId="Adm_ItemStoreListing";
  selectAllModeVlaue = 'allPages'; 
  selectionModeValue = 'all';
  functionIdFilter = "Cpn_ItemFilter";
  controlList: any[];
  groupControlList = {};
  model: ItemSearch;
  customerId = "";
  customerSearchForm: FormGroup;
  source = "Local";
  downloadTemplate()
  {
    this.commonService.download('M_ItemStoreListing.xlsx');
  }
  constructor(private itemService: ItemService,private commonService: CommonService, private alertify: AlertifyService,  private storeService: StoreService, private router: Router, private authService: AuthService,
              private route: ActivatedRoute, private formBuilder: FormBuilder, private excelSrv: ExcelService, private controlService: ControlService) { 
                this.model = new ItemSearch();
                this.contentReady = this.contentReady.bind(this);
                this.userParams.company = this.authService.getCurrentInfor().companyCode; 
              }
 isFirstRender = true;
 @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
 loadedNumber = 0;

 pageNumber = 1;
 pageSize = 500;
//  userParams: any = {};
 
//  resolve(route: ActivatedRouteSnapshot): Observable<Item[]> {
//      debugger;
//      return .pipe(
//          catchError(error => {
//              this.alertify.error('Problem retrieving data');
//              this.router.navigate(['/admin']);
//              return of(null);
//          })
//      );
storeList: MStore[] =[];
selectedKey = [];
capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
applyStoreListing()
{ 
  
  if(this.items !== null && this.items!==undefined && this.items?.length > 0)
  {
    let model: any = {};
        model.companyCode =this.authService.getCurrentInfor().companyCode;
        model.createdBy =this.authService.getCurrentInfor().username;
        model.storeList = this.selectedKey ;
        model.itemList = this.items;
        debugger;
        this.itemService.applyStoreListing(  model).subscribe((response: any) =>{
          if(response.success)
          {
              Swal.fire({
                icon: 'success',
                title: 'Apply Store Listing',
                text: "Apply store listing successfully completed"
              });
          }
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Apply Store Listing',
              text: response.message
            });
          }
        }, error =>{
          Swal.fire({
            icon: 'error',
            title: 'Apply Store Listing',
            text: "Apply Store Listing failed"
          });
        })
  }
  else
  {
    Swal.fire({
      icon: 'warning',
      title: 'Store Listing',
      text: "Please check item list"
    });
  }
     
}
loadStoreList()
{
  this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) =>{
    if(response.success)
    {
      this.storeList = response.data;
      console.log('this.storeList', this.storeList);
    }
    else
    {
      this.alertify.warning(response.message);
    }
  })
}
 contentReady(e) {
  
 
    // let value = this.gridContainer.instance.getVisibleRows()  as any;
    // let index = this.gridContainer.instance.getVisibleRows().length - 1 ;
    // let lastIndex = value[index];
    // let indexItem  =lastIndex.data.stt as number;
    // debugger;
    // if(index+1 < this.items.length && indexItem == this.items.length && this.loadedNumber < this.items.length) 
    // {
    //   this.loadedNumber = this.items.length;
     
    //   console.log('Load Compnent');
       
    //   this.itemService.getItemPagedList(this.pageNumber, this.pageSize, this.userParams ).subscribe((response: any) => {
      
    //     debugger;
    //     if(response.success===null || response.success===undefined)
    //     {
         
    //       let numStt= this.items.length;
    //       response.result.forEach(line => {
    //         numStt = numStt+ 1;
    //         line.stt =numStt ;
    //       });
    //       this.items.push(... response.result);
    //     }
    //     else
    //     {
    //       this.alertify.warning(response.message);
    //     }
     
    //   }, error => {
    //     this.alertify.error(error);
    //   });
    
    // }
   
}
  // loadData()
  // {
  //       this.itemService.getItems(this.pageNumber, this.pageSize, this.userParams ).subscribe((response: any) => {
      
  //       debugger;
  //       if(response.success===null || response.success===undefined)
  //       {
         
  //         let numStt= this.items.length;
  //         response.result.forEach(line => {
  //           numStt = numStt+ 1;
  //           line.stt =numStt ;
  //         });
  //         this.items.push(... response.result);
  //       }
  //       else
  //       {
  //         this.alertify.warning(response.message);
  //       }
     
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  // }
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    this.getControlList();
    this.loadStoreList();
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else
    {
    // this.route
        // this.loadItems();
        debugger;
        // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
        // this.loadItemPagedList();
        this.route.data.subscribe(data => {
          debugger;
          this.items = data['items']?.data;
          // this.items = data['items'].result;
          // this.pagination = data['items'].pagination;
          // debugger;
          
        // this.userParams.keyword = ''; 
        // this.userParams.orderBy = 'byName';

          // data['items']
        });
       
        let numStt = 0;
        if(  this.items !== null &&   this.items!==undefined &&   this.items?.length > 0)
        {
          this.items.forEach(line => {
            numStt = numStt+ 1;
            line.stt =numStt ;
          });
        }
       
        console.log( this.items);
    }
    
    
  }

  importContent: Item[] = [];
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);
     
 
      const header: string[] = Object.getOwnPropertyNames(new Item());
      
      //  debugger;
      // console.log(data);
      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 
      
      this.importContent = importedDataHeader.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelHeader.length; i++) { 
          for(let j = 0; j < header.length; j++)
          {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]); 
            // debugger;
             if(ki.toLowerCase() ===kj.toLowerCase())
             {
              debugger;
              let a =typeof header[j];
              if(header[j]==="defaultPrice")
              {
                obj[header[j]] = arr[i];
              }
              else
              {
                if(header[j].toLowerCase()==="isserial" || header[j].toLowerCase()==="isbom")
                {
                  if(arr[i]!==null || arr[i]!==undefined || arr[i]!=="undefined" || arr[i].toString()!=="0")
                  {
                    obj[header[j]] = false;
                  }
                  else{
                    obj[header[j]] = true;
                  }
                }
                else
                {
                  if(arr[i]!==null && arr[i]!==undefined && arr[i]!=="undefined")
                  {
                    obj[header[j]] = arr[i].toString();
                  }
                  else{
                    obj[header[j]] = null;
                  }
                }
              
              }
             }
          } 
        }
       

        return  <Item>obj;
      })
      console.log(this.importContent);
      debugger;
      if(this.importContent!==null && this.importContent!==undefined && this.importContent?.length > 0)
      {
        debugger;
        let list = [];
        this.importContent.forEach(element => { 
          debugger;
          list.push(element.itemCode );
        });
        debugger;

        this.itemService.getItemsByList(this.authService.getCurrentInfor().companyCode, this.authService.getCurrentInfor().username, list).subscribe((response: any) =>{
          if(response.success)
          {
            this.items = response.data;
          }
          else
          {
            Swal.fire({
              icon: 'warning',
              title: 'Get item infor from file',
              text:  response.message
            });
          }
        }, error=>{
          Swal.fire({
            icon: 'error',
            title: 'Get item infor from file',
           
          });
        })
      }
    };
   

  }
  @ViewChild('template' , { static: false}) template;  
  onToolbarPreparing(e) {
    // e.toolbarOptions.items.unshift( {
    //         location: 'before',
    //         widget: 'dxButton',
    //         options: {
    //             width: 136, 
    //             icon:"add", type:"success", text:"Import",
    //             // onClick: this.openModal.bind(this, true, null, this.template)
    //         } 
    //     });
        e.toolbarOptions.items.unshift( 
          {
            location: 'before',
            template: 'totalGroupCount'
        }, 
           
        )
  }
 
  getItem(item: Item)
  {
    debugger;
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
     this.router.navigate(["admin/masterdata/item", item.itemCode]);
  }
  // newItem()
  // {
  //   // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
  //    this.router.navigate(["admin/masterdata/item", item.itemCode]);
  // }

  getControlList() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionIdFilter).subscribe((response: any) => {
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        // this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1); 

        console.log("controlList", this.controlList);
        console.log("response", response.data);
        let group: any = {};
        response.data.forEach(item => {
          if (item.controlType === "DateTime") {
            debugger;
            if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: null, disabled: false });
            }
            else {
              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false });
            }
          }
          else {
            group[item.controlId] = [''];

          }
        });

        this.customerSearchForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {
          // this.controlList.forEach(item=>{
          //   item.isView=this.checkPermission(item.controlId,'V')
          // });
          var groups = this.controlList.reduce(function (obj, item) {
            obj[item.controlType] = obj[item.controlType] || [];

            obj[item.controlType].push({
              controlId: item.controlId,
              companyCode: item.companyCode,
              controlName: item.controlName,
              functionId: item.functionId,
              action: item.action,
              controlType: item.controlType,
              createdBy: item.createdBy,
              createdOn: item.createdOn,
              optionName: item.optionName,
              require: item.require,
              optionKey: item.optionKey,
              custom1: item.custom1,
              custom2: item.custom2,
              optionValue: item.optionValue,
              status: item.status,
              orderNum: item.orderNum,
              isView: item.isView,
            });
            return obj;
          }, {});
          this.groupControlList = Object.keys(groups).map(function (key) {
            let indexKey = 0;
            if (key === "CheckBox") {
              indexKey = 6;
            } else if (key === "DateTime") {
              indexKey = 2;
            } else if (key === "TextBox") {
              indexKey = 3;
            } else if (key === "DropDown") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          this.route.params.subscribe(data => {
            // this.customerId = data['id'];
            // if (this.customerId === null || this.customerId === undefined) {
            //   this.customerId = "";
            // }
            // if (this.source === 'Capi') {
            //   // this.customers = null;

            // }
            // else {
            //   // this.source = "Local";


            //   // this.searchItem();
            // }

          });

          console.log("this.groupControlList", this.groupControlList);
        }
      }
    });
  }
  showGrid = false;
  clickEvent() {
    this.status = !this.status;
  }
  status: boolean = false;
  loadItem(itemcode, uomcode, barcode, keyword, merchandise, Group, ItemCate1, ItemCate2, ItemCate3, CustomF1, CustomF2, CustomF3, CustomF4, CustomF5
    , CustomF6, CustomF7, CustomF8, CustomF9, CustomF10, ValidFrom, ValidTo, IsSerial, IsBOM, IsVoucher, IsCapacity, CustomerGrpId) {
    // debugger;
    this.itemService.getItems(this.authService.getCurrentInfor().companyCode, "", itemcode,  keyword, uomcode, barcode, merchandise, Group, ItemCate1, ItemCate2, ItemCate3, CustomF1, CustomF2, CustomF3, CustomF4, CustomF5
      , CustomF6, CustomF7, CustomF8, CustomF9, CustomF10, ValidFrom, ValidTo, IsSerial, IsBOM, IsVoucher, IsCapacity, CustomerGrpId,'', '','','').subscribe((response: any) => {
        if (response.success) {

          this.items = response.data;//.filter(x => x.barCode !== '');
          let numStt = 0;
          console.log(this.items);
          if( this.items?.length > 0)
          {
            this.items.forEach(line => {
              numStt = numStt+ 1;
              line.stt =numStt ;
            });
          }
       
          // this.items.map((todo, i) => { todo.responseTime = response.responseTime});
          setTimeout(() => { 
            // this will make the execution after the above boolean has changed
            this.showGrid = true; 
          },100);

          
        }
        else {
          this.alertify.warning(response.message);
        }
      });
  }
  searchItem(){
    let filter = this.model;
    
    let CustomerGroupId = "";
    
    // debugger;
    this.loadItem(filter.itemCode === null ? '' : filter.itemCode, filter.uomcode === null ? '' : filter.uomcode, filter.barcode === null ? '' : filter.barcode, filter.keyword === null ? '' : filter.keyword, filter.merchandise === null ? '' : filter.merchandise
      , filter.group === null ? '' : filter.group, filter.itemCate1 === null ? '' : filter.itemCate1, filter.itemCate2 === null ? '' : filter.itemCate2, filter.itemCate3 === null ? '' : filter.itemCate3,
      filter.customF1 === null ? '' : filter.customF1, filter.customF2 === null ? '' : filter.customF2, filter.customF3 === null ? '' : filter.customF3, filter.customF4 === null ? '' : filter.customF4,
      filter.customF5 === null ? '' : filter.customF5, filter.customF6 === null ? '' : filter.customF6, filter.customF7 === null ? '' : filter.customF7, filter.customF8 === null ? '' : filter.customF8,
      filter.customF9 === null ? '' : filter.customF9, filter.customF10 === null ? '' : filter.customF10, filter.validFrom === null ? '' : filter.validFrom, filter.validTo === null ? '' : filter.validTo,
      filter.isSerial === null ? '' : filter.isSerial, this.model.isBOM !== null && this.model.isBOM !== undefined ? this.model.isBOM : '', filter.isVoucher === null ? '' : filter.isVoucher, filter.isCapacity === null ? '' : filter.isCapacity, CustomerGroupId);
  }

}
