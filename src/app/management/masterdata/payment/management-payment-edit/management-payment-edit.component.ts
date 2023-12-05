import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThumbnailsMode } from 'ng-gallery';
import { MArea } from 'src/app/_models/area';
import { MPaymentMethod } from 'src/app/_models/paymentmethod';
import { DropView } from 'src/app/_models/viewmodel/DropView';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { PaymentmethodService } from 'src/app/_services/data/paymentmethod.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-payment-edit',
  templateUrl: './management-payment-edit.component.html',
  styleUrls: ['./management-payment-edit.component.scss']
})
export class ManagementPaymentEditComponent implements OnInit {


  @Input() model: MPaymentMethod; 
  functionId = "Adm_PaymentMaster";
  @Input() isNew= false;
  editForm: FormGroup;
  @Output() outModel = new EventEmitter<any>();
  @HostListener('window:beforeunload', ['$event'])
  marked = false;
  theCheckbox = false;
  companyOptions=[];   
  groupControlList = {};
  statusOptions = [
    {
      value: "A", name: "Active",
    },
    {
      value: "I", name: "Inactive",
    },
  ];
  paymentTypes=[];
  payments=[];
  bankNameOptions=[];
  sourceViews = [];
  setDataSoure(strSource)
  {
    // debugger;
    let source = [];
    if(this.sourceViews?.length > 0)
    {
       let ViewSource = this.sourceViews.find(x=>x.id === strSource);
       source  = ViewSource?.models;
      //  debugger;
    }
    return source;
  }

  loadPaymentList()
  {
    this.paymentService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      console.log( "response.data", response.data);
      if(response.success)
      {
        this.payments= response.data;//.filter(x=>x.Status === 'A') ;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  loadPaymentType()
  {
    this.paymentService.getPaymentType().subscribe((response: any)=>{
      console.log( "response.data", response.data);
      this.paymentTypes= response.data.filter(x=>x.Status === 'A') ;

      this.loadPaymentList();
    });
  }
  loadBank()
  {
    this.commonService.getPOSOption("BankName").subscribe((response: any)=>{
      console.log( "response.data", response.data);
      this.bankNameOptions= response.data.filter(x=>x.Status === 'A') ;
    });
  }

  controlList: any[];
  constructor(private paymentService: PaymentmethodService, private controlService: ControlService, private commonService: CommonService, 
     private authService: AuthService,  private alertifyService: AlertifyService ,
     private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) 
  {
   
  }
  checkPermission(controlId: string, permission: string): boolean
  {
    
    return this.authService.checkRole(this.functionId , controlId, permission );
  }
    
  initDataCompleted = false;
  gridControlComponent = [];
  viewGrid = false;
  checkFilterPermission(controlId: string, permission: string): boolean {
    let res = this.authService.checkRole(this.functionId, controlId, permission);
    // console.log('res', controlId + ' - ' + res);
    return res
  }
  ngOnInit() {
    debugger;
 
    if(this.model.fatherId !==null && this.model.fatherId !== undefined && this.model.fatherId?.length > 0)
    {
      let x: any = [];
      let splt= this.model.fatherId.split(',');
      splt.forEach(element => {
        x.push(element);
      });
      this.model.fatherId = x;
    }
    if(this.model?.mappings ===undefined || this.model?.mappings ===null || this.model?.mappings?.length <= 0)
    {
      this.model.mappings = [];
    } 
    console.log('this.model', this.model);

    this.loadPaymentType();
    this.loadBank();
     this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionId).subscribe((response: any)=>{
       if(response.data.length > 0)
       {
        debugger;
        // this.controlList= response.data.filter(x=>x.controlType !== 'Button');
        this.controlList = response.data.filter(x => x.controlType !== 'Button' && x.controlType !== 'Grid' && x.controlType !== 'GridColumn');
        this.gridControlComponent= response.data.filter(x=>x.custom2!=='button' && x.controlType === 'GridColumn') ;
        this.gridControlComponent.map((todo, i) => { 
          let controlIdSplit = todo.controlId.split("_"); 
          if(controlIdSplit?.length > 1)
          {
            todo.controlId =controlIdSplit[1];
          } 
         });
        this.gridControlComponent= this.gridControlComponent.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  );

        console.log(this.controlList);
         let group: any = {  };
         this.controlList.forEach(item=>{
          
           if(item.controlType ==="DateTime" || item.controlType === 'Date')
           {

            // invalidDate.setDate(today.getDate());
            let date = new Date(this.model[item.controlId]);
            this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false })
              //group["createdOn"] = new FormControl({ value: date, disabled: false })
              // this.model[item.controlId].setDate(this.model[item.controlId]);
              console.log(this.model[item.controlId]);
              
           }
           else{
              if((item.controlType?.toLowerCase() === "dropdown" || item.controlType?.toLowerCase() === "tagbox" ) && item.custom1?.length > 0 )
              {
                let dropView: DropView = new DropView();
                dropView.id = item.controlId; 
                dropView.name = item.optionName; 
                dropView.query = item.custom1;
                this.sourceViews.push(dropView);
              }
              
              group[item.controlId] = [''];
            
           }
         });

         this.gridControlComponent.forEach(item=>{
          if((item.custom2?.toLowerCase() === "dropdown" || item.controlType?.toLowerCase() === "tagbox" ) && item.custom1?.length > 0 )
          {
            let dropView: DropView = new DropView();
            dropView.id = "grid_" + item.controlId; 
            dropView.name = item.optionName; 
            dropView.query = item.queryStr;
            this.sourceViews.push(dropView);
          }
         
        });
       debugger;
      
        this.editForm = this.formBuilder.group(group);
        // if(this.model.createdBy === null || this.model.createdBy === "" || this.model.createdBy === undefined)
        // {
        //   this.isNew = true;
        // }

       
        if (this.controlList.length > 0) {
          this.controlList.forEach(item=>{
            item.isView=this.checkPermission(item.controlId,'V'),
            item.isEdit=this.checkPermission(item.controlId,'E'),
            item.isInsert=this.checkPermission(item.controlId,'I')
          });
          console.log("controlList", this.controlList);
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
              isView:item.isView,
              isEdit:item.isEdit,
              isInsert:item.isInsert,
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
            } else if (key === "DropDown" || key === "TagBox") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          debugger;
          if(this.sourceViews?.length > 0)
          {
            let store= this.authService.storeSelected();
            let dropStt= 0;
            let loadDataStt = this.sourceViews.filter(x=>x.query?.length > 0).length;
            this.sourceViews.forEach(drop => {
              if(drop?.query?.length > 0)
              {
                this.commonService.getQuery(store.companyCode, drop.id, drop.query).subscribe((response: any) =>{
                  dropStt++;
                  if(response.success)
                  {
                     drop.models = response.data;
                     console.log(drop.id, drop.models);
                  }
                  else
                  {
                    this.alertifyService.error(response.message);
                  }
                  // debugger;
                  if(dropStt === loadDataStt )
                  {
                    this.initDataCompleted= true;
                  }
                })
      
              }
            }, error =>{
              this.initDataCompleted= true;
              this.alertifyService.error(error);
            });
          }
          else
          {
            this.initDataCompleted= true;
          }
          console.log("this.groupControlList", this.groupControlList);
        }
        this.viewGrid = this.checkPermission('rptGrid' ,'V');
       }
      });
     
   
  }
   
  update() { 
    debugger;
    
    // this.model.companyCode = "CP001";
    this.model.createdBy = this.authService.decodeToken?.unique_name;
    if(this.model.status=== null || this.model.status===undefined || this.model.status === "")
      this.model.status = this.statusOptions[0].value;
    if(this.model.fatherId?.length >0)
    {
      let convert: any = this.model.fatherId;
      let strF ='';
      convert.forEach(element => {
        strF += element + ','; 
      });
      if(strF?.length >0)
      {
        strF = strF.substring(0, strF.length-1);
      }
      this.model.fatherId = strF;
    }

    this.outModel.emit(this.model); 
  }
  toggleVisibility(e){
    this.marked= e.target.checked;
  }

}
