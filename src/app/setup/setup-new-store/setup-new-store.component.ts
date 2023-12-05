import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setup-new-store',
  templateUrl: './setup-new-store.component.html',
  styleUrls: ['./setup-new-store.component.scss']
})
export class SetupNewStoreComponent implements OnInit {
  typeOptions = [
    {
      value: "S", name: "Vendor",
    },
    {
      value: "C", name: "Customer",
    },
  ];
  constructor(private commonService: CommonService, private router: Router) { 
    this.model = new ObjectInitNewData();
  }
   
  ngOnInit() {

  }
  model:ObjectInitNewData;
  loading= false;
  idFocus="";
  onFocus(txt: any)
  {
    let IdFocus = txt.id;
    let IdValue = txt.value;
     this.idFocus = IdFocus;
    // debugger;

  }
  backtoLogin()
  {
    this.router.navigate(['/login']).then(()=>{
      window.location.reload();
    });
  }
  setup()
  { 
    this.loading = true;
    if(this.model.isServer===null ||this.model.isServer===undefined)
    {
      this.model.isServer= false;
    }
    console.log('this.model', this.model);
    this.commonService.InitDb(this.model).subscribe((response: any) =>{
      this.loading = false;
      if(response.success)
      {
        Swal.fire('Init DB', 'Init store successfully completed', 'success');
      }
      else
      {
        Swal.fire('Init DB', response.message, 'warning');
      }
    }, error=>{ 
      this.loading = false;
      console.error('error Init DB',error);
      Swal.fire('Init DB','Failed to init db','error');
    } )
  }
}

export class ObjectInitNewData {
    serverName: string;
    databaseName: string;
    dbUser: string;
    dbPassword: string;
    storeId: string;
    storeName: string;
    storeAddress: string;
    isServer: boolean | null; 
}