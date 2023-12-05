import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MControl } from 'src/app/_models/control';
import { MPermission } from 'src/app/_models/mpermission';
import { NodeUpdateModel } from 'src/app/_models/viewmodel/FunctionNodeModel';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-setting-control-permission',
  templateUrl: './management-setting-control-permission.component.html',
  styleUrls: ['./management-setting-control-permission.component.scss'],
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
        animate('600ms ease-in', style({ transform: 'translateX(0%)', 'opacity': 1 }))
      ]),
      
      transition(':leave', [
        style({ transform: 'translateX(0%)', opacity: 1 }),
        animate('0ms ease-in', style({ transform: 'translateX(100%)', 'opacity': 0 }))
      ])
    ])
  ]
})
export class ManagementSettingControlPermissionComponent implements OnInit {

  @Input() selectNode: any;
  functionList: any;
  cols: any[];
  selectedNodes: any;
  list: any = [];
  roles: any =[];
  showEdit= false;
  isNew= false;
  permission: MPermission;
  control: MControl;
  height: number;
  
  constructor(  private permissionService: PermissionService, private controlService: ControlService, private authService: AuthService,
    private alertify: AlertifyService, private router: Router,  private route: ActivatedRoute) {
      
     }

  toggleAddNew(): void {
    this.showEdit = !this.showEdit;
    this.isNew= true;
  }
  getHeight()  {
    this.height = window.innerHeight / 1.5;
  }
  RoleId = ""; //= this.route.params['id'];
 
  ngOnInit() {
    
    this.getHeight() ;
    console.log(this.height);
    this.route.params.subscribe(data => {
      this.RoleId = data['id'];
    })
    this.loadData();
    this.control = new MControl();
    this.control.status='A';
    // this.control.roleId = this.RoleId;
    this.control.functionId = this.selectNode.functionId;
    this.onReorder = this.onReorder.bind(this);

    console.log("cunction " + this.control.functionId);
  }
  editControl(controlId)
  {
    debugger;
    this.controlService.getControl(this.authService.getCurrentInfor().companyCode, controlId, this.selectNode.functionId).subscribe((response: any)=> {
      
      this.control = response.data;
      this.isNew= false;
      this.showEdit= true;
    })
    
  }
  saveControl(control: MControl)
  {
    debugger;
    if(this.isNew)
    {
      this.controlService.create(control).subscribe((response: any)=>{
        if(response.success)
        {
           
           this.alertify.warning("Add new control successfully.");
           this.showEdit = false;
            this.loadData();
          
        }
        else
        {
            this.alertify.warning(response.message);
        }
      });
    }
    else{
      this.controlService.update(control).subscribe((response: any)=>{
        if(response.success)
        { 
           this.alertify.warning("Update successfully.");
           this.showEdit = false;
          this.loadData();
          
          
        }
        else
        {
            this.alertify.warning(response.message);
        }
      });
    }
    // this.permission.functionId = this.selectNode.fu
   
  }
  savePermission(permission: MPermission)
  {
    debugger;
    // this.permission.functionId = this.selectNode.fu
    this.permissionService.create(permission).subscribe((response: any)=>{
      if(response.success)
      {
         this.loadData();
         this.alertify.warning("Add new permission completed successfully.");
      }
      else
      {
          this.alertify.warning(response.message);
      }
    });
  }
  onchange(dataRow, col, value)
  {
    
    
      debugger;
    //  this.list = this.functionList.filter((node: TreeNode) => node.children);
    //  this.list =this.list.filter((node: TreeNode) => node.name === event.name);
    //  if(!event.node.children) {
    //    console.log(event.node.children);
    //   // this.signalenCodeNode = event.node.data
    //   // this.getParentDetails(event.node)
    // }
      // console.log(this.files5);
      let model = new MPermission();
      model.createdBy =  this.authService.decodeToken?.unique_name;
      model.roleId = this.RoleId;
      model.controlId = dataRow.ControlId;
      model.functionId = this.selectNode.functionId;
      model.companyCode = this.authService.storeSelected().companyCode;
      model.permissions = col;
      if(value === true)
      {
        model.status = "A";
      }
      else{
        model.status = "I";
      } 
      this.permissionService.updateNode(model).subscribe((response: any) => {
       debugger;
         if(!response.success)
         {
            this.alertify.error(response.message);
         }
      }, error => {
        this.alertify.error(error);
      });
  }
  allowDropInsideItem: boolean = true;
  allowReordering: boolean = true;
  showDragIcons: boolean = true;
  onDragChange(e) {
    // debugger;
    let visibleRows = e.component.getVisibleRows(),
        sourceNode = e.component.getNodeByKey(e.itemData.ControlId),
        targetNode = visibleRows[e.toIndex].node;

    while(targetNode && targetNode.data) {
        if (targetNode.data.ControlId === sourceNode.data.ControlId) {
            e.cancel = true;
            break;
        }
        targetNode = targetNode.parent;
    }
}

onReorder(e) {

  let visibleRows =  e.component.getVisibleRows(),
  sourceData = e.itemData,
  targetData = visibleRows[e.toIndex].data;

  if (e.dropInsideItem) {
    e.itemData.OderNum = targetData.ControlId;
    e.component.refresh();
  } else {
    let sourceIndex = this.functionList.indexOf(sourceData),
        targetIndex = this.functionList.indexOf(targetData);

    if (sourceData.OderNum !== targetData.OderNum) {
        sourceData.OderNum = targetData.OderNum;
        if (e.toIndex > e.fromIndex) {
            targetIndex++;
        }
    }

    this.functionList.splice(sourceIndex, 1);
    this.functionList.splice(targetIndex, 0, sourceData);
    // console.log(this.functionList);
    this.functionList.forEach(control => {
      control.functionId = this.control.functionId;
      control.companyCode= this.authService.storeSelected().companyCode;
    });
    this.controlService.updateOrderNum(this.functionList).subscribe((response: any)=>{
      if(response.success)
      {
        this.alertify.warning("Updated");
      }
      else{
        this.alertify.warning(response.message);
      }
    });
  }
}
  allCheck(type, value)
  {
    
    let RoleId = ""; //= this.route.params['id'];
    this.route.params.subscribe(data => {
      RoleId = data['id'];
    })
    debugger;
    
  
    // this.list = this.functionList.filter((node: TreeNode) => node.children);
    //  this.list =this.list.filter((node: TreeNode) => node.name === event.name);
    //  if(!event.node.children) {
    //    console.log(event.node.children);
    //   // this.signalenCodeNode = event.node.data
    //   // this.getParentDetails(event.node)
    // }
    let permissionList: MPermission[] =[];
    this.list.forEach(dataRow=>{
      let model = new MPermission();
      // dataRow.data.
      model.roleId = RoleId;
      model.controlId = dataRow.data.ControlId;
      model.functionId = this.selectNode.functionId;
      model.companyCode = this.authService.storeSelected().companyCode;
      model.permissions = type.field;
      if(value.checked === true)
      {
        model.status = "A";
      }
      else{
        model.status = "I";
      } 
      permissionList.push(model);
    })
    debugger;
    this.permissionService.updateListNode(permissionList).subscribe((response: any) => {
     
       if(!response.success)
       {
          this.alertify.error(response.message);
       }
    }, error => {
      this.alertify.error(error);
    });
  }
  loadheader()
  {
    this.permissionService.getHeaderControlPermissionGrid().subscribe((response: any) => {
      debugger;
      if(response.success)
      {
        this.cols = response.data.filter(x=>x.field !== 'D'); 
        this.saveColumn = response.data.filter(x=>x.field !== 'D'); 
      }
      else
      {
        this.alertify.error(response.message);
      }
      console.log(this.cols);
    });
  }
  gridControls: any =[];
  saveControls: any =[];
  gridName="";
  isGridComponent= false;
  saveColumn = [];
  editGridControl(gridName)
  {
    debugger;
    this.cols = this.cols.filter(x=> x.field !== 'D' && x.field !== 'E' && x.field !== 'I' && x.field !== 'A');
    this.saveControls = this.functionList;
    this.functionList = this.gridControls.filter(x=>x.Custom1===gridName);
    this.isGridComponent=true;
    this.gridName = gridName;
  }
  backToControlList()
  {
    this.isGridComponent=false;
    this.functionList = this.saveControls;
    this.cols = this.saveColumn;
    this.gridName ="";
  }
  loadData()
  {
    debugger;
    this.permissionService.GetControlPermissionListByFunction(this.selectNode.functionId, this.RoleId.toString()).subscribe((response: any)=>{
     
      if(response.success && response.data!==null && response.data!==undefined && response.data.length > 0)
      {
        debugger;
         
        this.functionList = response.data.filter(x=>x.ControlType!=='GridColumn');
        this.functionList= this.functionList.sort(( a, b ) => a.OrderNum > b.OrderNum ? 1 : -1  );
        console.log(this.functionList)
        this.gridControls =  response.data.filter(x=>x.ControlType==='GridColumn');
        this.gridControls= this.gridControls.sort(( a, b ) => a.OrderNum > b.OrderNum ? 1 : -1  );
        this.loadheader();
        if(this.gridName!==null && this.gridName!==undefined && this.gridName!=='')
        {
         this.editGridControl(this.gridName);
        }
      }
      else{
        // this.alertify.error(response.message);
        // this.alertify.warning('Function ');
      }
     
      
    }, error =>{
      console.log('error GetControlPermission', error);
      Swal.fire('Get Control','Failed to get data','error')
    });
  }
}
