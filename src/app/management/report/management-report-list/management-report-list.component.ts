import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-report-list',
  templateUrl: './management-report-list.component.html',
  styleUrls: ['./management-report-list.component.scss']
})
export class ManagementReportListComponent implements OnInit {

  constructor(private routerNav: Router) { }

  ngOnInit() {
    this.loadMenu();
  }
   
  rptList: any;
  loadMenu()
  {
    let permissions = JSON.parse(localStorage.getItem("permissions")) ;
   
    if(permissions!==null)
    {
      // this.menuList = permissions.filter(x=>x.ParentId === "AdminPage" && x.V > 0 && x.ControlId === null && x.functionId!=="Adm_MORE"); 
      // this.subList = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1===null); 
      // let group = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1!==null);
      // this.subListItemGroup = permissions.filter(x=>x.ParentId === "Adm_MORE" && x.ControlId === null && x.V > 0 && x.CustomF1!==null); 
      // this.subListGroup= group.map(({ CustomF1 }) => CustomF1).filter((x, i, a) => a.indexOf(x) == i);

      let reports = permissions.filter(x=>x.ParentId==='Adm_Report'  && x.ControlId === null && x.V > 0);
      console.log(this.rptList);
      debugger;
      // if(item.CustomF1===null || item.CustomF1===undefined || item.CustomF1==='')
      // {
      //   item.CustomF1 = menu.CustomF1;
      // }
      var groups = reports.reduce(function (obj, item) { 
        obj[item.CustomF1] = obj[item.CustomF1] || [] ;
        obj[item.CustomF1].name= item.CustomF1; 
        obj[item.CustomF1].push({
          ControlId: item.ControlId,
          Url: item.Url,
          Icon: item.Icon,
          Name: item.Name,
          ParentId: item.ParentId,
          functionId: item.functionId, 
          
          CustomF1: item.CustomF1 ,
          CustomF2: item.CustomF2,
          CustomF3: item.CustomF3, 
        });
        
        return obj;
      }, {});
      let evilResponseProps = Object.keys(groups);
      // Step 2. Create an empty array.
      let goodResponse = [];
      
      // Step 3. Iterate throw all keys.
      for (let prop of evilResponseProps) { 
       
          goodResponse.push(groups[prop]);
      }
      
     
      this.rptList= goodResponse.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
      console.log(this.rptList);
    }
   
  }
  parentList=[];
  noparentList=[];
  filter(items: any[], key: string ) 
  {
    // debugger;
    let list =items.filter(x=>x.CustomF1 === key[0]);
    // console.log(list);
    return list;
  }
  
}
