import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MStoreArea } from 'src/app/_models/mstorearea';
import { MStoreCapacity } from 'src/app/_models/mstorecapacity';
import { MStore } from 'src/app/_models/store';
import { TimeFrameViewModel } from 'src/app/_models/timeframe';
import { AuthService } from 'src/app/_services/auth.service';
import { CapacityService } from 'src/app/_services/data/capacity.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { StoreareaService } from 'src/app/_services/data/storearea.service';
import { TimeframeService } from 'src/app/_services/data/timeframe.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { status } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-capacity-list',
  templateUrl: './management-capacity-list.component.html',
  styleUrls: ['./management-capacity-list.component.scss']
})
export class ManagementCapacityListComponent implements OnInit {
  timeframeList: TimeFrameViewModel[];
  storeList: MStore[];
  storeAreaList: MStoreArea[];
  storeCapacityList: MStoreCapacity[];
  store: MStore;
  storeSelected: string="";
  mode:string="";
  status = status.active;
  constructor(public authService: AuthService, private storeService: StoreService,  private router: Router,  private storeAreaService: StoreareaService, private capacityService: CapacityService,
    private alertifyService: AlertifyService, private timeframeService: TimeframeService) { 
      this.storeCapacityList=null;

     }
     @ViewChild('dataGrid' , { static: false}) dataGrid;  
   
    // Prior to Angular 8
    // @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    checkValidatingData(e)
    {
      debugger;
      if (e.isValid && e.newData.Login === "Administrator") {
          e.isValid = false;
          e.errorText = "Your cannot log in as Administrator";
      }
    }
    removeCapacity(e)
    {
      debugger;
      let model = e.data;
      
      this.store= this.getStoreModel(this.storeSelected);
      model.storeId = this.storeSelected;
      this.capacityService.delete(model).subscribe((response: any)=>{
        if(response.success)
        {
            this.alertifyService.success("Delete completed successfully");
        }
        else{
          this.alertifyService.warning("Delete failed: " + response.message);
        }
     });
    }
    getStoreModel(storeCode)
    {
        return this.storeList.find(x=>x.storeId===storeCode);
    }
    functionId = "Adm_Capacity";
    statusOptions: any = [
    
      { name: 'Active', value: 'A' },
      { name: 'In Active', value: 'I' },
      
    ];
    saveToAllByStore(value, status)
    {
      if(this.storeSelected!==null && this.storeSelected!==undefined && this.storeSelected?.length > 0)
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
            let model = new MStoreCapacity();
            model.storeId = this.storeSelected;
            model.companyCode = this.authService.getCompanyInfor().companyCode; 
            model.maxCapacity = value;
            model.status = status;
            this.capacityService.update(model).subscribe((response: any)=>{
              if(response.success)
              {
                  this.alertifyService.success("update completed successfully");
                  this.loadCapacity(this.storeSelected, '');
              }
              else{
                this.alertifyService.warning("update failed: " + response.message);
              }
           });
          }
        });

       
      }
      else
      {
        this.alertifyService.warning("Please select store update");
      }
      
    }
    saveCapacity(e) {
      debugger;
     
      
      let model = e.changes[0].data;
      model.storeId = this.storeSelected;
      if(this.mode==='E')
      {
        let check =  this.authService.checkRole(this.functionId , '', 'E' );
        if(check===true)
        {
          this.capacityService.update(model).subscribe((response: any)=>{
            if(response.success)
            {
                this.alertifyService.success("update completed successfully");
            }
            else{
              this.alertifyService.warning("update failed: " + response.message);
            }
         });
        }
        else
        {
          this.alertifyService.success("Permission denied");
        }
         
      }
      else
      {
        let check =  this.authService.checkRole(this.functionId , '', 'I' );
        if(check===true)
        {
          this.capacityService.create(model).subscribe((response: any)=>{
            debugger;
            if(response.success)
            {
                this.alertifyService.success("insert completed successfully");
            }
            else{
              this.alertifyService.warning("insert failed: " + response.message);
            }
        });
        }
        else
        {
          this.alertifyService.success("Permission denied.");
        }
      }
      // this.events.unshift(eventName);
    }
  ngOnInit() {
    // this.store = this.authService.storeSelected();
   
    // this.loadTimeFrame();
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    else
    {
      this.loadStore();
    }
  }
  loadStore()
  {
    this.storeService.getByUser(this.authService.getCurrentInfor().username).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeList= response.data;
        if(this.storeList!==null && this.storeList!==undefined && this.storeList?.length > 0)
        {
          this.storeList.map((todo, i) => { todo.storeName = todo.storeId + ' - ' + todo.storeName;
          // if (todo.storeId == newRecordToUpdate.storeId){
             
          //  }
         });
        }
        

      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }
  loadStoreArea()
  {
    this.storeAreaService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>{
      if(response.success)
      {
        this.storeAreaList= response.data;
      }
      else{
        this.alertifyService.warning(response.message);
      }
    
    });
  }
  storeView = "";
  loadCapacity(store, storearea)
  {
    debugger;
    if(store===null || store===undefined || store==="undefined" || store=== '')
    {
      this.alertifyService.warning("please select Store");
    }
    else
    {
      this.storeView = store;
      this.loadStoreArea();
      this.loadTimeFrame();
      this.store= this.getStoreModel(this.storeSelected);
      this.capacityService.getCapacityByAreaStore(this.store.companyCode, store, storearea).subscribe((response: any)=>{
        if(response.success)
        {
          this.storeCapacityList = response.data; 
        }
        else
        {
          this.alertifyService.warning("load capacity data failed: " + response.message);
        }
      });
    }
    
  }
  loadTimeFrame()
  {
    this.store= this.getStoreModel(this.storeSelected);
    this.timeframeService.getTimeFrame(this.store.companyCode, '').subscribe((response: any)=>{
      if(response.success)
      {
        this.timeframeList = response.data;
      }
      else
      {
        this.alertifyService.warning(response.message);
      }
     
    });
  }

}
