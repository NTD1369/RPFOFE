import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MEmployee } from 'src/app/_models/employee';
import { MStore } from 'src/app/_models/store';
import { IBasketItem } from 'src/app/_models/system/basket';
import { TSalesStaff } from 'src/app/_models/tsaleline';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { EmployeeService } from 'src/app/_services/data/employee.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-shop-tools-assign-staff',
  templateUrl: './shop-tools-assign-staff.component.html',
  styleUrls: ['./shop-tools-assign-staff.component.scss']
})
export class ShopToolsAssignStaffComponent implements OnInit {
  employeeList: MEmployee[] = [];
  employeeListX: MEmployee[] = [];
  selectedKey = [];
  allMode: string;
  checkBoxesMode: string;
  @Input() item: IBasketItem;
  @Input() AssignType = "OnBill";
  @ViewChild('ddlStaff', { static: false }) ddlStaff: DxSelectBoxComponent;
  constructor(public modalRef: BsModalService, private basketService: BasketService, private alertifyService: AlertifyService, private employeeService: EmployeeService,  private authService: AuthService) 
  {
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
  }
  loadSetting() {
    // let mode = this.authService.getGeneralSettingStore(this.store.companyCode, this.store.storeId).find(x => x.settingId === 'CustomerDisplayMode');
    // if (mode !== null && mode !== undefined) {
    //   this.customerMode = mode.settingValue;
    // }
    let employeeSystemData = this.authService.getGeneralSettingStore(this.storeSelected.companyCode, this.storeSelected.storeId).find(x => x.settingId === 'EmployeeSystem');
    if (employeeSystemData !== null && employeeSystemData !== undefined) {
      this.employeeSystem = employeeSystemData.settingValue;
    }
  }
  assignStaff()
  {
    debugger;
    let basket = this.basketService.getCurrentBasket();
    if(this.AssignType === "OnBill")
    { 
      basket.staffs = [];
      this.basketService.setBasketNotRunPromotion(basket);
      basket = this.basketService.getCurrentBasket();
      basket.staffs = [];
      debugger;
      if(this.ddlStaff.value!== null && this.ddlStaff.value!==undefined && this.ddlStaff.value?.length > 0 )
      {
        let staff: TSalesStaff = new TSalesStaff();
        staff.companyCode = this.storeSelected.companyCode;
        staff.storeId = this.storeSelected.storeId;
        staff.staff = this.ddlStaff.value;
        staff.position= "Consultant"; 
        basket.staffs.push(staff);
      }
      if(this.selectedKey!==null && this.selectedKey!==undefined && this.selectedKey?.length > 0)
      {
        this.selectedKey.forEach(staff => {
          let staffinsert: TSalesStaff = new TSalesStaff();
          staffinsert.companyCode = this.storeSelected.companyCode;
          staffinsert.storeId = this.storeSelected.storeId;
          staffinsert.staff = staff.employeeId;
          staffinsert.position= "Implementation"; 
          basket.staffs.push(staffinsert);
        });
      }
      
      this.basketService.setBasketNotRunPromotion(basket);
  
      this.modalRef.hide();
    }
    else  
    {
     
      let iteminbasket = basket.items.find(x=>x.lineNum === this.item.lineNum);
      iteminbasket.staffs = [];
      if(this.ddlStaff.value!== null && this.ddlStaff.value!==undefined && this.ddlStaff.value?.length > 0 )
      {
        let staff: TSalesStaff = new TSalesStaff();
        staff.companyCode = this.storeSelected.companyCode;
        staff.storeId = this.storeSelected.storeId;
        staff.staff = this.ddlStaff.value;
        staff.position= "Consultant"; 
        iteminbasket.staffs.push(staff);
      }
      if(this.selectedKey!==null && this.selectedKey!==undefined && this.selectedKey?.length > 0)
      {
        this.selectedKey.forEach(staff => {
          let staffinsert: TSalesStaff = new TSalesStaff();
          staffinsert.companyCode = this.storeSelected.companyCode;
          staffinsert.storeId = this.storeSelected.storeId;
          staffinsert.staff = staff.employeeId;
          staffinsert.position= "Implementation"; 
          iteminbasket.staffs.push(staffinsert);
        });
      }
  
      this.basketService.setBasketNotRunPromotion(basket);
  
      this.modalRef.hide();
    }
    
  }
  // loadEmployee() {
  //   let checkAv = false;
  //   if(this.employeeSystem !== 'Local')
  //   {
  //     checkAv = true;
  //   }
  //   if(checkAv)
  //   {

  //     this.employeeService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId, checkAv).subscribe((response: any) => {
  //       if(response.success)
  //       {
  
  //         this.employees = response.data;
  //       }
  //       else
  //       {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'Employee Data',
  //           text: response.message
  //         });
  //       }
  //     });
  //   }
  //   else
  //   {
      
  //     this.employeeService.getByStore(this.authService.storeSelected().companyCode, this.authService.storeSelected().storeId).subscribe((response: any) => {
  //       if(response.success)
  //       {

  //         this.employees = response.data;
  //       }
  //       else
  //       {
  //         Swal.fire({
  //           icon: 'warning',
  //           title: 'Employee Data',
  //           text: response.message
  //         });
  //       }
  //     });
  //   }
  // }
  employeeSystem = "Local";
  loadEmployee()
  {
    let checkAv = false;
    if(this.employeeSystem !== 'Local')
    {
      checkAv = true;
    }
    if(checkAv)
    {
      this.employeeService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId, checkAv).subscribe((response: any)=>{
        this.initData = true;
        if(response.success)
        {
          this.employeeList = response.data; 
          if(this.employeeList!==undefined && this.employeeList!==null && this.employeeList?.length > 0)
          {
            let basket = this.basketService.getCurrentBasket();
            debugger;
            if(this.AssignType === "OnBill")
            {
              if(basket?.staffs!== null && basket?.staffs!==undefined && basket.staffs?.length > 0 )
              {
                 debugger;
                let cons = basket?.staffs.filter(x=>x.position === 'Consultant');
                if(cons!==undefined && cons !== null && cons?.length >0)
                {
                  // if(this.ddlStaff!==null && this.ddlStaff!==undefined)
                  // {
                    
                  // }
                  this.consultant= cons[0].staff ;
                }
                let Imple = basket?.staffs.filter(x=>x.position === 'Implementation');
                if(Imple!==undefined && Imple !== null && Imple?.length >0)
                {
                  // Imple.forEach(element => {
                  //   this.selectedKey.push(element.staff);
                  // });
                  let arrList = [];
                  Imple.forEach(staff => {
                    let employee = this.employeeList.find(x=>x.employeeId === staff.staff);
                    arrList.push(employee); 
                    //  this.selectedKey.push(staff.staff); 
                  });
                  this.selectedKey = arrList;
                }
                
              }
            }
            else
            {
              let iteminbasket = basket.items.find(x=>x?.barcode === this.item.barcode);
              debugger;
              if(iteminbasket.staffs!==null && iteminbasket.staffs!==undefined && iteminbasket.staffs?.length > 0)
              {
                let consultant = iteminbasket.staffs.find(x=>x.position ==='Consultant');
                if(consultant!==null && consultant!==undefined)
                { 
                    this.consultant = consultant.staff;
                }
                let staffImplements = iteminbasket.staffs.filter(x=>x.position !=='Consultant');
                if(staffImplements!==null && staffImplements!==undefined && staffImplements?.length > 0)
                {
                  let arrList = [];
                  staffImplements.forEach(staff => {
                    let employee = this.employeeList.find(x=>x.employeeId === staff.staff);
                    arrList.push(employee); 
                    //  this.selectedKey.push(staff.staff); 
                  });
                  this.selectedKey = arrList;
                  
                }
                console.log('this.selectedKey', this.selectedKey);
              
              }
              
            }
          
          }
        }
        else
        {
          
          this.alertifyService.warning(response.message);
        }
      }, error => {
        this.initData = true;
        this.alertifyService.warning(error);
      })
    }
    else
    {
      this.employeeService.getByStore(this.storeSelected.companyCode, this.storeSelected.storeId).subscribe((response: any)=>{
        this.initData = true;
        if(response.success)
        {
          this.employeeList = response.data; 
          if(this.employeeList!==undefined && this.employeeList!==null && this.employeeList?.length > 0)
          {
            let basket = this.basketService.getCurrentBasket();

            if(this.AssignType === "OnBill")
            {
              
              if(basket?.staffs!== null && basket?.staffs!==undefined && basket.staffs?.length > 0 )
              {
                 debugger;
                let cons = basket?.staffs.filter(x=>x.position === 'Consultant');
                if(cons!==undefined && cons !== null && cons?.length >0)
                {
                   this.consultant = cons[0].staff ;
                  // if(this.ddlStaff!==null && this.ddlStaff!==undefined)
                  // {
                  //   this.ddlStaff.value = cons[0].staff ;
                  // }
                }
                let Imple = basket?.staffs.filter(x=>x.position === 'Implementation');
                if(Imple!==undefined && Imple !== null && Imple?.length >0)
                {
                  // Imple.forEach(element => {
                  //   this.selectedKey.push(element.staff);
                  // });
                  let arrList = [];
                  Imple.forEach(staff => {
                    let employee = this.employeeList.find(x=>x.employeeId === staff.staff);
                    arrList.push(employee); 
                    //  this.selectedKey.push(staff.staff); 
                  });
                  this.selectedKey = arrList;
                }
                
              }
              // if(this.selectedKey!==null && this.selectedKey!==undefined && this.selectedKey?.length > 0)
              // {
              //   this.selectedKey.forEach(staff => {
              //     let staffinsert: TSalesStaff = new TSalesStaff();
              //     staffinsert.companyCode = this.storeSelected.companyCode;
              //     staffinsert.storeId = this.storeSelected.storeId;
              //     staffinsert.staff = staff.employeeId;
              //     staffinsert.position= "Implementation"; 
              //     basket.staffs.push(staffinsert);
              //   });
              // }
              
            }
            else
            {
              let iteminbasket = basket.items.find(x=>x.barcode === this.item.barcode);
              debugger;
              if(iteminbasket.staffs!==null && iteminbasket.staffs!==undefined && iteminbasket.staffs?.length > 0)
              {
                let consultant = iteminbasket.staffs.find(x=>x.position ==='Consultant');
                if(consultant!==null && consultant!==undefined)
                { 
                    this.consultant = consultant.staff;
                }
                let staffImplements = iteminbasket.staffs.filter(x=>x.position !=='Consultant');
                if(staffImplements!==null && staffImplements!==undefined && staffImplements?.length > 0)
                {
                  let arrList = [];
                  staffImplements.forEach(staff => {
                    let employee = this.employeeList.find(x=>x.employeeId === staff.staff);
                    arrList.push(employee); 
                    //  this.selectedKey.push(staff.staff); 
                  });
                  this.selectedKey = arrList;
                }
                console.log('this.selectedKey', this.selectedKey);
              
              }
            }
            
            
          }
        }
        else
        {
          
          this.alertifyService.warning(response.message);
        }
      }, error => {
        this.initData = true;
        this.alertifyService.warning(error);
      })
    }
  }
  storeSelected: MStore;
  consultant = "";
  initData= false;
  ngAfterViewInit() {
    setTimeout(() => {
      this.loadEmployee();
    }, 50);
     this.loadSetting();

   
  }
  ngOnInit() {
    if(this.AssignType==="OnItem")
    {
      if(this.item!==undefined && this.item!==null )
      { 
        this.storeSelected = this.authService.storeSelected();
        
      }
      else
      {
        this.alertifyService.warning('Selected Item is null. Please try again');
      }
    }
    else
    {
      this.storeSelected = this.authService.storeSelected();
      
    }  
  }

}
