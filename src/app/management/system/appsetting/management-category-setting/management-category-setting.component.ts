import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MMerchandiseCategory } from 'src/app/_models/merchandise';
import { AuthService } from 'src/app/_services/auth.service';
import { Merchandise_categoryService } from 'src/app/_services/data/merchandise_category.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-category-setting',
  templateUrl: './management-category-setting.component.html',
  styleUrls: ['./management-category-setting.component.scss']
})
export class ManagementCategorySettingComponent implements OnInit {

  merchanLst: MMerchandiseCategory[]=[];

  selectAllModeVlaue: string = "page";
  selectionModeValue: string = "all";

  doingTasks: MMerchandiseCategory[]=[];
  plannedTasks: MMerchandiseCategory[]=[];
  constructor(private merchandiseService: Merchandise_categoryService, private router: Router, private alrtifyService: AlertifyService,  private authService: AuthService) { }
  selectedKey = [];
  functionId="Adm_MerchandiseSetting";
  ngOnInit() {
    let check =  this.authService.checkRole(this.functionId , '', 'V' );
    if(check === false)
    {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadCategory();
  }
  ngAfterViewInit() {
    debugger;
    
  }
  saveModel()
  {
    debugger;

    this.doingTasks.forEach((item, index) => {
      item.isShow= true;
      item.orderNum =index;
    });
    this.merchandiseService.updateSetting(this.doingTasks).subscribe((response: any) => {
      if(response.success)
      {
        this.alrtifyService.success('Create completed successfully'); 
        
      }
      else{
        this.alrtifyService.warning(response.message);
      } 
    }, error => {
      this.alrtifyService.error(error);
    });
    
  }
  onSelectionChanged(e)
  {
    debugger;
    let currentSelectedRowKeys = e.currentSelectedRowKeys;
    let currentDeselectedRowKeys = e.currentDeselectedRowKeys;
    let allSelectedRowKeys = e.selectedRowKeys;
    let allSelectedRowsData = e.selectedRowsData;
    if(e.addedItems.length >0)
    {
      e.addedItems.forEach(itemadd => {
        this.doingTasks.push(itemadd);
      });
    
    } 
    if(e.removedItems.length > 0)
    {
      debugger;
      e.removedItems.forEach(itemremove => { 
        debugger;
        this.doingTasks = this.doingTasks.filter(item => item.mcid !== itemremove.mcid); 
      });
     
    }
    this.doingTasks= this.doingTasks.sort(( a, b ) => a.orderNum > b.orderNum ? 1 : -1  )
    // removedItems
  }
  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
      e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
      e.fromData.splice(e.fromIndex, 1);
  }    
  loadCategory()
  {
    this.merchandiseService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any)=>
    {
      if(response.success)
      {
        this.merchanLst= response.data;
        this.plannedTasks= response.data;
        this.plannedTasks.forEach((item)=> {
          if(item.isShow)
          {
            this.selectedKey.push(item.mcid);
    
          }
        });
      }
      // else
      // {
      //   this.alertify.warning(response.message);
      // }
     
      // debugger;
    })
  }
}
