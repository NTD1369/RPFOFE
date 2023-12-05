import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxTreeViewComponent } from 'devextreme-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShopToolClearCacheComponent } from 'src/app/shop/tools/shop-tool-clear-cache/shop-tool-clear-cache.component';
import { ShopToolsSettlementComponent } from 'src/app/shop/tools/shop-tools-settlement/shop-tools-settlement.component';
import { AuthService } from 'src/app/_services/auth.service';
import { ExcuteFunctionService } from 'src/app/_services/common/excuteFunction.service';
import { FunctionService } from 'src/app/_services/system/function.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-component-more-menu',
  templateUrl: './component-more-menu.component.html',
  styleUrls: ['./component-more-menu.component.scss'],
  animations: [
    trigger(
      'slideView',
      [
        state('true', style({ transform: 'translateX(100%)', opacity: 0 })),
        state('false', style({ transform: 'translateX(0)', opacity: 1 })),
        transition('0 => 1', animate('500ms', style({ transform: 'translateX(0)', 'opacity': 1 }))),
        transition('1 => 1', animate('500ms', style({ transform: 'translateX(100%)', 'opacity': 0 }))),
      ]),

    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)', 'opacity': 1 }))
      ]),

      transition(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('0ms ease-in', style({ transform: 'translateX(100%)', 'opacity': 0 }))
      ])
    ])


  ]
})
export class ComponentMoreMenuComponent implements OnInit {
  @Input() showDrop = true;
  showSubMenu: boolean = false;
  menuList: any[];
  subList: any[];
  subListGroup: any[];
  subListItemGroup: any[];
  updateContentTimer: number;
  scrollByContent = true;
  scrollByThumb = true;
  scrollbarMode: string;
  pullDown = false;


  @Output() closeMoreMenu = new EventEmitter<any>();
  constructor(private functionService: FunctionService, public modalService: BsModalService, private excuteFunction: ExcuteFunctionService, private authService: AuthService) { }
  closeMore() {
    // debugger;
    this.showDrop = false;
    this.closeMoreMenu.emit(false);

  }
  ngOnInit() {
    // debugger;
    this.showDrop = true;
    this.showSub = false;
    this.selectedMenu = null;
    this.loadNodeFunction();
  }
  backtoMenu() {
    this.showSub = false;
    this.selectedMenu = null;
    this.searchShow = true;
  }
  menuListX: any[];
  loadNodeFunction() {
    this.functionService.getFunctionExpandAll(this.authService.getCurrentInfor().companyCode, this.authService.decodeToken?.unique_name).subscribe((response: any) => {
      if (response.success) {

        this.menuListX = response.data;
      }


      // debugger;
      console.log('this.menuListX', this.menuListX);
    });
  }
  treeBoxValue: string[];
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  syncTreeViewSelection(e) {
    var component = (e && e.component) || (this.treeView && this.treeView.instance);

    if (!component) return;

    if (!this.treeBoxValue) {
      component.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach((function (value) {
        component.selectItem(value);
      }).bind(this));
    }
  }

  treeView_itemSelectionChanged(e) {
    this.treeBoxValue = e.component.getSelectedNodeKeys();

  }
  async detectMultiMonitor()
  {
    // Detect if the device has more than one screen.
    

      if (window.screen.isExtended) {
        debugger;

        // this.permissionStatus =   navigator.permissions;
       
        // Request information required to place content on specific screens.
        const screenDetails = await window.getScreenDetails();
 
        console.log('screenDetails', screenDetails.screens);
        // // Detect when a screen is added or removed.
        // screenDetails.addEventListener('screenschange', onScreensChange);

        // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
        // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

        // Find the primary screen, show some content fullscreen there.
        const primaryScreen = screenDetails.screens.find(s => s.isPrimary);
        // document.documentElement.requestFullscreen({screen : primaryScreen});

        // Find a different screen, fill its available area with a new window.
        const otherScreen = screenDetails.screens.find(s => !s.isPrimary);
        // let fullscreenOptions = { navigationUI: "auto" };

        window.open("shop/order-display", '_blank', `menubar=no,location=no,resizable=no,scrollbars=no,status=yes,left=${otherScreen.availLeft},` +
                                  `top=${otherScreen.availTop},` +
                                  `width=${otherScreen.availWidth},` +
                                  `height=${otherScreen.availHeight}`); 
                                  
                                  // setTimeout(() => {
                                  //   myWindow.focus()
                                  // })
      
      } else {
        // Detect when an attribute of the legacy <code data-opaque bs-autolink-syntax='`Screen`'>Screen</code> interface changes.
        // window.screen.addEventListener('change', onScreenChange);

        // Arrange content within the traditional single-screen environment... 
       
        // Request information required to place content on specific screens.
        const screenDetails = await window.getScreenDetails();
 
        console.log('screenDetails', screenDetails.screens);
        // // Detect when a screen is added or removed.
        // screenDetails.addEventListener('screenschange', onScreensChange);

        // // Detect when the current <code data-opaque bs-autolink-syntax='`ScreenDetailed`'>ScreenDetailed</code> or an attribute thereof changes.
        // screenDetails.addEventListener('currentscreenchange', onCurrentScreenChange);

        // Find the primary screen, show some content fullscreen there.
        const otherScreen = screenDetails.screens.find(s => s.isPrimary);
        document.documentElement.requestFullscreen({screen : otherScreen});

        // Find a different screen, fill its available area with a new window.
        // const otherScreen = screenDetails.screens.find(s => !s.isPrimary);
        // let fullscreenOptions = { navigationUI: "auto" };

         window.open("shop/order-display", '_blank', `resizable=yes,status=no,toolbar=no,scrollbars=yes,location=no,menubar=no,left=${otherScreen.availLeft},` +
                                  `top=${otherScreen.availTop},` +
                                  `width=${otherScreen.availWidth},` +
                                  `height=${otherScreen.availHeight}`); 


                                  
      }
  }
 toolFunction(functionAction)
  {
    debugger;
    let msg = "";
    switch (functionAction?.toLowerCase()) {
      case 'opendrawer': {
        //statements; 
        let checkAction = this.authService.checkRole('Spc_OpenDrawer', '', 'I');
        if (checkAction) {
          this.excuteFunction.openDrawer();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'castdisplay': {
        //statements; 
        let checkAction = this.authService.checkRole('Spc_CastDisplay', '', 'I');
        if (checkAction) {
          this.detectMultiMonitor();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'clearcache': {
        //statements; 
        this.closeMore();
        let checkAction = this.authService.checkRole('Tool_ClearCache', '', 'I');
        if (checkAction) {

          this.modalService.show(ShopToolClearCacheComponent, {
            // initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          // const { value: formValues } = await Swal.fire({
          //   title: 'Multiple inputs',
          //   html:
          //     'Key: <input id="swal-input1" class="swal2-input">' +
          //     'Prefix: <input id="swal-input2" class="swal2-input">',
          //   focusConfirm: false,
          //   preConfirm: () => {
          //     return [
          //       document.getElementById('swal-input1').value,
          //       document.getElementById('swal-input2').value
          //     ]
          //   }
          // })
          
         
          // this.excuteFunction.clearCache();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;
      }
      case 'sendbankeod': {

        this.closeMore();
        let checkAction = this.authService.checkRole('Tool_SendBankEOD', '', 'I');
        if (checkAction) {

          this.modalService.show(ShopToolsSettlementComponent, {
            // initialState, 
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true,
            ariaDescribedby: 'my-modal-description',
            ariaLabelledBy: 'my-modal-title',
            class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
          });
          // const { value: formValues } = await Swal.fire({
          //   title: 'Multiple inputs',
          //   html:
          //     'Key: <input id="swal-input1" class="swal2-input">' +
          //     'Prefix: <input id="swal-input2" class="swal2-input">',
          //   focusConfirm: false,
          //   preConfirm: () => {
          //     return [
          //       document.getElementById('swal-input1').value,
          //       document.getElementById('swal-input2').value
          //     ]
          //   }
          // })
          
         
          // this.excuteFunction.clearCache();
        }
        else
        {
          msg = "Permission denied.";
        } 
        break;

        // let checkAction = this.authService.checkRole('Tool_SendBankEOD', '', 'I');
        // if (checkAction) {
        //   this.excuteFunction.sendBankEOD();
        // }
        // else
        // {
        //   msg = "Permission denied.";
        // } 
        // break;
       
      }
      default: {
        //statements; 
        msg = "Function maintainace or building.";
        break;
      }
    }
    if(msg?.length > 0)
    {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: msg
      });
    }
  }
  toggleAddNew(menu): void {
    this.showSub = !this.showSub;
    debugger;
    let menuLines = menu.lines.filter(x => (x.Url !== null && x.Url !== undefined && x.Url !== '') || (x.CustomF2 !== null && x.CustomF2 !== undefined && x.CustomF2 !== '') );
    var groups = menuLines.reduce(function (obj, item) {

      // console.log("groups", groups);
      // console.log("item", item);
      if (item.CustomF1 === null || item.CustomF1 === undefined || item.CustomF1 === '') {
        item.CustomF1 = menu.CustomF1;
      }
      obj[item.CustomF1] = obj[item.CustomF1] || [];
      obj[item.CustomF1].name = item.CustomF1;
      obj[item.CustomF1].push({
        ControlId: item.ControlId,
        Url: item.Url,
        Icon: item.Icon,
        Name: item.Name,
        ParentId: item.ParentId,
        functionId: item.functionId,

        CustomF1: item.CustomF1,
        CustomF2: item.CustomF2,
        CustomF3: item.CustomF3,
        OrderNo: item.OrderNo

      });

      return obj;
    }, {});
    // Step 1. Get all the object keys.
    let evilResponseProps = Object.keys(groups);

    // Step 2. Create an empty array.
    let goodResponse = [];

    // Step 3. Iterate throw all keys.
    for (let prop of evilResponseProps) {
      goodResponse.push(groups[prop]);
    }

    console.log("aaa",goodResponse);
    console.log("bbb",goodResponse.sort((a, b) => a.OrderNo - b.OrderNo));
    // users.sort((a, b) => a.firstname !== b.firstname ? a.firstname < b.firstname ? -1 : 1 : 0);
    // .filter(x=>x.Url!==null && x.Url!==undefined &&  x.Url!== '')
    this.selectedMenu = goodResponse.sort();
    this.searchShow = !this.searchShow;
  }
  selectedMenu: any;
  ngAfterViewInit() {

    this.loadMenu();
  }
  showSub = false;
  newlist: any[];
  newlist1: any[] = [];
  parentList: any[];
  noparentList: any[];
  searchShow = true;
  loadMenu() {
    let permissions = JSON.parse(localStorage.getItem("permissions"));
    if (permissions !== null) {
      this.menuList = permissions.filter(x => x.ParentId === "AdminPage" && x.V > 0 && x.ControlId === null && x.functionId !== "Adm_MORE");
      this.subList = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1 === null);
      let group = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1 !== null);
      this.subListItemGroup = permissions.filter(x => x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1 !== null);
      this.subListGroup = group.map(({ CustomF1 }) => CustomF1).filter((x, i, a) => a.indexOf(x) == i);
      debugger;
      //&& x.ControlId === null
      this.newlist = permissions.filter(x => (x.isParent === true && x.V > 0 && x.ControlId === null) || (x.functionId !== "Adm_MORE" && x.V > 0 && x.ControlId === null));
      this.newlist.forEach(itemFunction => {
        if (itemFunction.isParent === true || itemFunction.ParentId === "Adm_MORE") {
          //  debugger;
          if (itemFunction.functionId !== "Adm_MORE") {
            this.newlist1.push(itemFunction);
          }

        }
      });
      this.newlist1.forEach(itemFunction => {
        let list = this.newlist.filter(x => x.ParentId === itemFunction.functionId);
        itemFunction.lines = list;
      });
      this.parentList = this.newlist1.filter(x => x.isParent === true).sort((a, b) => a.Name !== b.Name ? a.Name < b.Name ? -1 : 1 : 0);
      this.noparentList = this.newlist1.filter(x => x.isParent !== true).sort((a, b) => a.Name !== b.Name ? a.name < b.Name ? -1 : 1 : 0);
    }

    // console.log(selectedIds.filter((x, i, a) => a.indexOf(x) == i));
    // console.log(this.subListGroup);
    // console.log(this.subListItemGroup);
  }
  filter(items: any[], key: string) {
    // debugger;
    let list = items.filter(x => x.CustomF1 === key[0]);
    // console.log(list);
    return list;
  }
}
