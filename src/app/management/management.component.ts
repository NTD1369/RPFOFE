import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDrawerComponent } from 'devextreme-angular';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MCompany } from '../_models/company';
import { MStore } from '../_models/store';
import { TShiftHeader } from '../_models/tshiftheader';
import { AuthService } from '../_services/auth.service';
import { CommonService } from '../_services/common/common.service';
import { ClientDisallowanceService } from '../_services/data/client-disallowance.service';
import { ShiftService } from '../_services/data/shift.service';
import { StoreService } from '../_services/data/store.service';
import { StoreclientService } from '../_services/data/storeclient.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  selectedOpenMode: string = 'overlap';
  selectedPosition: string = 'left';
  selectedRevealMode: string = 'slide';
  isDrawerOpen: Boolean = false; 
  isMore: boolean= false;
  selectedStore: MStore;
  showFiller=false; 
  storeList: MStore[];
  isVirtualKey = false;
  showSubMenu: boolean = false;
  menuList: any[];
  subList: any[];
  subListGroup: any[];
  subListItemGroup: any[];
  isShowMore = false;
  companyInfor:MCompany;
  currentShift: TShiftHeader;
  ShowMenu$: Observable<boolean>;
  switchVirtualKey(value)
  {
    debugger;
    this.commonService.changeVirtualKey(value);
    
  }

  showDissallowanceList = false;
  disallowanceList= [];
  dissallowanceView()
  {
    debugger;
    this.showDissallowanceList=!this.showDissallowanceList;

    if(this.showDissallowanceList===true)
    {
     let storeClient = this.authService.getStoreClient();
     let storeSelected = this.authService.storeSelected();
      if(storeClient!==null && storeClient!==undefined)
      {
        this.disallowanceList =  storeClient?.disallowances;
        // this.counterService.getAll(storeClient.companyCode, storeSelected.storeId, '', storeClient.localIP,'').subscribe((response: any) => {
        //   // debugger;
        //   // localStorage.setItem("GetDisallowance", 'true');
        //   if (response.success === false) {
        //     // this..warning(response.message);
        //     Swal.fire('Disallowance',response.message,'warning');
        //     // console.log('Client disallowance message',response.message);
        //   }
        //   else {
        //     this.disallowanceList = response.data;
        //     // if(response.data!==null && response.data!==undefined && response.data?.length > 0)
        //     // { 
        //     //   localStorage.setItem("DisallowanceList", JSON.stringify(response.data)); 
        //     // }
        //     // else
        //     // {
        //     //   localStorage.setItem("DisallowanceList", null);
        //     // }
           
        //   } 
        // }, error =>{
        //   // localStorage.setItem("GetDisallowance", 'true');
        //   console.log('Disallowance error', error);

        // });
      }
     
    }
  }

  constructor( public commonService: CommonService, public storeClientService: StoreclientService, public authService: AuthService, private storeService: StoreService, 
    private router: Router, private counterService: ClientDisallowanceService,
     private shiftService: ShiftService) { 
    
  }
  closeDraw()
  {
    this.isDrawerOpen = false;
  }
  @ViewChild('drawer', { static: false }) drawer: DxDrawerComponent;
  ngAfterViewInit()
  {
    // debugger;
    const paymentMenu = document.getElementsByClassName('paymentMenu');
    Array.prototype.forEach.call(paymentMenu, function(item) {
      // Do stuff here
        if(item !== null && item !== undefined)
        {
          item.classList.remove('show');
          item.classList.add('hide');
          // console.log('manage');
        }
    });
    
  }
  toggleSideBar(event)
  {
    // debugger;
    this.isDrawerOpen = false;
    if(event===true)
    {
      this.isMore = true;
    }
    else
    {
      this.isMore = false;
    }
    // 
    this.isDrawerOpen = true;
  }
  // showRight()
  // {
  //   this.drawer.toggle();
  // }
  VirtualKey$: Observable<boolean>;

  
  terminalRequire = 'FingerId';

  loadSetting() {
    let terminalRequite = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'PrintItemShow');
    // debugger;
    if (terminalRequite !== null && terminalRequite !== undefined) {
      this.terminalRequire = terminalRequite.settingValue;
    }
    
  }
  redirectToDeviceSetup()
  {
    let url = this.router?.url?.toString();
    debugger;
    if(url!==null && url!==undefined && url!=='')
    {
      if(url.includes('/admin/device-setting/'))
      {
        url= url.replace('/admin/device-setting/','').split('%252F').join('/').split('%2F').join('/'); //
      }
    }
    if(url !== '/admin/device-setting')
    {
        if(url!==null && url!==undefined && url!=='')
        {
        this.router.navigate(['/admin/device-setting', url]);
        }
        else
        {
        this.router.navigate(['/admin/device-setting']);
        }
    }
  }

  ngOnInit() {
    // debugger;
    this.VirtualKey$ = this.commonService.VirtualKey$;
    this.companyInfor = this.authService.getCompanyInfor();
    this.ShowMenu$ = this.commonService.ShowMenu$;
    // this.currentShift = this.shiftService.getCurrentShip();
    let store= this.authService.storeSelected();
    if(store === null || store=== undefined)
    {
      this.loadSetting();
      this.storeService.getByUser(this.authService.decodeToken?.unique_name).subscribe((response: any)=>{
        if(response.success)
        {
          this.storeList=response.data;
        }
       
        // console.log(this.storeList);
      });
    }
    let storeClient = this.authService.getStoreClient();
    // debugger;
    if(storeClient===null || storeClient===undefined || storeClient?.publicIP === '' || storeClient?.publicIP === null || storeClient?.publicIP === undefined)
    {
      debugger;
      if(this.terminalRequire.toLowerCase()!=="fingerid")
      {
        this.redirectToDeviceSetup();
      }
    }
    else
    {
      if(this.terminalRequire.toLowerCase()!=="fingerid")
      {
        this.storeClientService.getById(this.selectedStore.companyCode , this.selectedStore.storeId, '', this.authService.getLocalIP() ,'').subscribe((response: any)=>{
          if(response.success)
          {
            debugger;
            let result = response.data;
            if(result=== null && result === undefined)
            {
              this.redirectToDeviceSetup();
            } 
          }
          else
          {
              this.redirectToDeviceSetup();
          }
        });
      }
    }
    let permissions = JSON.parse(localStorage.getItem("permissions")) ;
    // debugger;
    this.menuList = permissions.filter(x=>x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId!=="Adm_MORE"); 
    this.subList = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1===null); 
    let group = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1!==null);
    this.subListItemGroup = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V === 1 && x.CustomF1!==null); 
    this.subListGroup= group.map(({ CustomF1 }) => CustomF1).filter((x, i, a) => a.indexOf(x) == i);
    // console.log(selectedIds.filter((x, i, a) => a.indexOf(x) == i));
    // console.log(this.subListGroup);
    // console.log(this.subListItemGroup);
    // if(permissions.some(x=>x.ParentId === "AdminPage" && x.V === 1 && x.ControlId === null && x.functionId ==="Adm_MORE"))
    // {
        
        
    // }
  }
  filter(items: any[], key: string ) 
  {
    // debugger;
    let list =items.filter(x=>x.CustomF1 === key[0]);
    // console.log(list);
    return list;
  }
  changeStore()
  {  
    console.log("selectedStore", this.selectedStore);
    this.authService.setStoreSelected(this.selectedStore);
    
  }
  isShown: boolean;
  togleSubmenu(event)
  {
    this.isShown = event;
  }
  togleSubmenuClick()
  {
    this.isShown = !this.isShown;
  }

}
