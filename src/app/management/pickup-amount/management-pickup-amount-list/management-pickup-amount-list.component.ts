import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShopPickupAmountInputComponent } from 'src/app/shop/tools/shop-pickup-amount-input/shop-pickup-amount-input.component';
import { MStoreArea } from 'src/app/_models/mstorearea';
import { TPickupAmount } from 'src/app/_models/pickupamount';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { PickupAmountService } from 'src/app/_services/data/pickupAmount.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';
// import { exportDataGrid } from 'devextreme/pdf_exporter';
@Component({
  selector: 'app-management-pickup-amount-list',
  templateUrl: './management-pickup-amount-list.component.html',
  styleUrls: ['./management-pickup-amount-list.component.scss']
})
export class ManagementPickupAmountListComponent implements OnInit {

  
  functionId = "Adm_PickupHistorical";
  items: TPickupAmount[];
 
  userParams: any = {};
  isNew: boolean = false;
  lguAdd: string = "Add";

  constructor(private pickupService: PickupAmountService, private alertify: AlertifyService, private storeService: StoreService, private router: Router, public authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
  }
  fromDate: Date;
  toDate: Date;
  storelist : MStore[];
  storeId ="";
  loadCounter(store, from, to)
  {
    debugger;
    this.storeId = store.value;
    this.loadItems(from, to);
    // var d = new Date();
    // const year = d.getFullYear();
    // const month = d.getMonth(); 
    // const nowDate = d.getDate(); 
    // const lastDay =  new Date(year, month +1, 0).getDate();

    // let now =  year + '/' + (month + 1) + '/' + nowDate ;

    //  this.counterService.GetCounterSalesInDay(this.authService.getCurrentInfor().companyCode, this.storeId, now).subscribe((response: any)=>{
    //    if(response.success)
    //    {
    //      debugger;
    //       this.counters = response.data.filter(x=>x.publicIP !== null && x.publicIP !== undefined && x.publicIP !== '');
    //    }
    //    else
    //    {
    //       this.alertify.warning(response.message);
    //    }
    //  })
  }
  loadStoreList()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {

        this.storelist = response.data;

        // let model:any = {storeId : "", storeName: "--- All ---"};
        // this.storelist.unshift(model);
        this.storelist.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
        
        // if (todo.storeId == newRecordToUpdate.storeId){
           
        //  }
       });
       this.storeId = this.authService.storeSelected().storeId;
      } 
      else
      {
        this.alertify.warning(response.message);
      }
      // this.storelist = response;
    })
  }
  defaultStoreId = "";
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  ngOnInit() {
    // this.route
    // let check = this.authService.checkRole(this.functionId, '', 'V');
    // if (check === false) {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }

    var d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); 
    const lastDay =  new Date(year, month +1, 0).getDate();

    this.fromDate = new Date(year + '/' + (month + 1) + '/1') ;
    this.toDate = new Date(year + '/' + (month + 1) + '/' + lastDay) ;
    this.loadStoreList();
    this.loadItems( this.fromDate , this.toDate);
     
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['whs'].result;
    //   this.pagination = data['whs'].pagination;
    //   // debugger;

    // this.userParams.keyword = ''; 
    // this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
  }
  // @ViewChild('template' , { static: false}) template;  
  // onToolbarPreparing(e) {
     
  //   e.toolbarOptions.items.unshift({
  //     location: 'before',
  //     widget: 'dxButton',
  //     options: {
  //       width: 136,
  //       icon: "add", type: "default", text: this.lguAdd,
  //       onClick: this.openModal.bind(this, true, null, this.template)
  //     }
  //   });
      
  // }
  modalRef: BsModalRef;
  model: TPickupAmount;
  openModal(isNew: boolean, model: TPickupAmount, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.model = new TPickupAmount();
      this.model.companyCode = this.authService.getCurrentInfor().companyCode;
    }
    else {
      this.model = model;
    }
    setTimeout(() => {
        // const initialState = { 
        //   pickupBy: this.authService.getCurrentInfor().username
        // };
        // let modalPickupRef = this.modalService.show(ShopPickupAmountInputComponent, {
        //   initialState, 
        //   animated: true,
        //   keyboard: true,
        //   backdrop: true,
        //   ignoreBackdropClick: true,
        //   ariaDescribedby: 'my-modal-description',
        //   ariaLabelledBy: 'my-modal-title',
        //   class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
        // });
       
        // modalPickupRef.content.outPickUp.subscribe((received: any) => {
        //   if(received.isClose)
        //   {
        //     modalPickupRef.hide();
        //   }
        //   else  
        //   {
        //     this.createPickup(received);
        //     modalPickupRef.hide();
        //   } 
        // });
    });

  }
  @ViewChild('template' , { static: false}) template;  
  // onToolbarPreparing(e) {
  //   e.toolbarOptions.items.unshift( {
  //           location: 'before',
  //           widget: 'dxButton',
  //           options: {
  //               width: 136, 
  //               icon:"add", type:"default", text:"Add",
  //               onClick: this.openModal.bind(this, true, null)
  //           } 
  //       });
  // }
  onToolbarPreparing(e) {
    // if(this.authService.checkRole(this.functionId , '', 'I'))
    // {
      e.toolbarOptions.items.unshift( 
        {
          location: 'before',
          template: 'totalGroupCount'
      }, 
      {
        location: 'before',
        template: 'exportoPDF'
    }, 
     
      
      
        );
      
  } 
  
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
 
  exportGrid() {
    this.dataGrid.instance.columnOption('print', 'visible', false); 
    const doc = new jsPDF();
    debugger;
    
    // exportDataGridToPdf({
    //   jsPDFDocument: doc,
    //   component: this.dataGrid.instance,
    // }).then(() => {

       
    //   doc.save('PickupAmount.pdf');
    //   setTimeout(() => {
        
    //     this.dataGrid.instance.columnOption('print', 'visible', true); 
    //   }, 20);
     
    // });

    let infor = this.authService.getCurrentInfor();

    let headerStore = this.storeId; 
    let headerStoreName = ''; 
    if(headerStore!==null && headerStore !==undefined && headerStore !== '')
    {
      headerStoreName = this.storelist.find(x=>x.storeId === headerStore).storeName; 
    }
    
    let headerBy = infor.username; 
    let headerDate = this.GetDateFormat(new Date()); 
    const pdfDoc = new jsPDF('p', 'pt', 'a4');
    const options = {
        jsPDFDocument: pdfDoc,
        component: this.dataGrid.instance,
        autoTableOptions: {
          margin: { top: 67 },
          
      }
    };
    
    exportDataGridToPdf(options).then(() => {
      pdfDoc.setFontSize(9);
      const pageCount = 1;// pdfDoc.internal.getNumberOfPages(); 
      // Header
      // pdfDoc.text("Store Id: " + headerStore, 40, 15, { baseline: 'top' });
      if(headerStoreName?.length > 0)
      {
        pdfDoc.text("Store: " + headerStoreName, 40, 15, { baseline: 'top' });
        pdfDoc.text("Print By: " + headerBy, 40, 32, { baseline: 'top' });
        pdfDoc.text("Print Date: " + headerDate, 40, 49, { baseline: 'top' });
      }
      else
      {
        pdfDoc.text("Print By: " + headerBy, 40, 15, { baseline: 'top' });
        pdfDoc.text("Print Date: " +headerDate, 40, 32, { baseline: 'top' });
      }
     

      // for (let i = 1; i <= pageCount; i++) {
      //     pdfDoc.setPage(i);
      //     const pageSize = pdfDoc.internal.pageSize;
      //     const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      //     const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
       

      //     // Footer
      //     pdfDoc.text(footer, pageWidth / 2 - (pdfDoc.getTextWidth(footer) / 2), pageHeight - 15, { baseline: 'bottom' });
      // }
    }).then(() => {
        pdfDoc.save('PickupCollection_'+headerDate+'.pdf');
        setTimeout(() => {
        
          this.dataGrid.instance.columnOption('print', 'visible', true); 
        }, 20);
    });
  }
  printOut: any;
  printPick(model)
  {
    // :counterid/:shiftid
    this.router.navigate(["admin/pickup-amount/print/", model.counterId, model.shiftId]).then(() => {
      window.location.reload();
    });
    // this.pickupService.GetItem(this.authService.getCurrentInfor().companyCode, model.storeId, '', model.counterId , model.shiftId , '' , '-1').subscribe((response: any) =>{

    //   if(response.success)
    //   {
    //     model = null;
    //     debugger;
    //     model = response.data; 
    //     this.printOut = model;
    //     console.log('this.printOut', this.printOut);
    //   }
    //   else
    //   {
    //     this.alertify.warning(response.message);
    //   }
    // })
     
  }
  openEditModal(model: TPickupAmount, NumOfList) {
  
    // this.requestUsb();
    
    this.pickupService.GetItem(this.authService.getCurrentInfor().companyCode, model.storeId, '', model.counterId , model.shiftId , '' , NumOfList).subscribe((response: any) =>{

      if(response.success)
      {
        model = null;
        debugger;
        model = response.data;
        setTimeout(() => {
          const initialState = { 
            isNew: false,
            isView: true,
            model: model,
          };
          let modalPickupRef = this.modalService.show(ShopPickupAmountInputComponent, {
            initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
         
          modalPickupRef.content.outPickUp.subscribe((received: any) => {
            if(received.isClose)
            {
              modalPickupRef.hide();
            }
            else  
            {
              // this.updatePickup(received);
              modalPickupRef.hide();
             
            } 
          });
        });
     
      }
      else
      {
        this.alertify.warning(response.message);
      }
    })
     
    //  model.pickupBy =  this.authService.getCurrentInfor().username;
   
  }
  createPickup(model)
  {
    this.pickupService.create(model).subscribe((response: any)=>{
      if(response.success)
      {
        this.alertify.success("Pickup amount " +  model.amount + " successfully completed");
      }
      else
      {

        this.alertify.error(response.message);
      }
    })
  }
  // loadPickupAmountList()
  // {
  //   var d = new Date();
  //   const year = d.getFullYear();
  //   const month = d.getMonth(); 
  //   const nowDate = d.getDate(); 
  //   const lastDay =  new Date(year, month +1, 0).getDate();

  //   let now =  year + '/' + (month + 1) + '/' + nowDate ;
  //   this.commonService.getDailyId(this.authService.getCurrentInfor().companyCode,this.storeId , '').subscribe((responseX: any)=>{
    
  //    if( responseX.success)
  //    {
  //     this.pickupAmountService.GetPickupAmountLst(this.authService.getCurrentInfor().companyCode,this.storeId ,  responseX.data , '', 'N').subscribe((response: any)=>{
  //       debugger;
  //       if(response.success)
  //       {
  //        debugger;
  //         this.pickupAmounts = response.data;
  //       }
  //       else
  //       {
  //         this.alertify.warning(response.message);
  //       }
  //    })
  //    }
  //    else 
  //    {
  //     this.alertify.warning(responseX.message); 
  //    }
  //   })
     
  // }
  loadItems(from, to) {
    let fromvl= null;  let tovl= null;
    if(from===null||from===undefined)
    {
      from=null;
    }
    if(to===null||to===undefined)
    {
      to=null;
    }
    if(from!=null)
    {
      fromvl=this.GetDateFormat(from);
    }
    if(to!=null)
    {
      tovl= this.GetDateFormat(to);
    }
    // companyCode, storeId, CounterId, ShiftId, PickupBy, CreatedBy, FDate, TDate
    this.pickupService.GetPickupAmountLst(this.authService.getCurrentInfor().companyCode, this.storeId,'' , '', '', fromvl,tovl).subscribe((response: any) => {
      // loadItems
      debugger;
      if (response.success) {
        this.items = response.data;
      }
      else {
        this.alertify.warning(response.message);
      }
      // this.items = res;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

}
 