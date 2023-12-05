import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { exportDataGrid } from 'devextreme/excel_exporter';
import saveAs from 'file-saver';
import { Workbook } from 'exceljs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/_models/pagination';
import { MUser } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/data/user.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ManagementUserStoreComponent } from '../management-user-store/management-user-store.component';
import Swal from 'sweetalert2';
import { LicenseInfor, SLicense } from 'src/app/_models/license';
import { CommonService } from 'src/app/_services/common/common.service';

@Component({
  selector: 'app-management-user-list',
  templateUrl: './management-user-list.component.html',
  styleUrls: ['./management-user-list.component.scss']
})
export class ManagementUserListComponent implements OnInit {


  items: MUser[];
  pagination: Pagination;
  userParams: any = {};
  isNew: boolean = false;
  lguAdd: string = "Add";
  passwordMode: string= '';
  licenseInfor: LicenseInfor;
  passwordButton: any= '';
  popupVisible = false;
  constructor( private userService: UserService, private alertify: AlertifyService, private commonService: CommonService, private router: Router, public authService: AuthService,
    private modalService: BsModalService, private route: ActivatedRoute) {

      this.licenseInfor = new LicenseInfor();

    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }
    // this.passwordButton = {
    //   icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVRYw+2YP0tcQRTFz65xFVJZpBBS2O2qVSrRUkwqYfUDpBbWQu3ELt/HLRQ/Q8RCGxVJrRDEwj9sTATxZ/Hugo4zL/NmV1xhD9xi59177pl9986fVwLUSyi/tYC+oL6gbuNDYtyUpLqkaUmfJY3a+G9JZ5J2JW1J2ivMDBSxeWCfeBxYTHSOWMcRYLOAEBebxtEVQWPASQdi2jgxro4E1YDTQIJjYM18hszGbew4EHNq/kmCvgDnHtI7YBko58SWgSXg1hN/btyFBM0AlwExczG1YDZrMS4uLUeUoDmgFfjLGwXEtG05wNXyTc4NXgzMCOAIGHD8q0ATuDZrempkwGJ9+AfUQ4K+A/eEseqZ/UbgdUw4fqs5vPeW+5mgBvBAPkLd8cPju+341P7D/WAaJGCdOFQI14kr6o/zvBKZYz11L5Okv5KGA89Kzu9K0b0s5ZXt5PjuOL6TRV5ZalFP4F+rrnhZ1Cs5vN6ijmn7Q162/ThZq9+YNW3MbfvDAOed5cxdGL+RFaUPKQtjI8DVAr66/u9i6+jJzTXm+HFEVqxVYBD4SNZNKzk109HxoycPaG0bIeugVDTp4hH2qdXJDu6xOAAWiuQoQdLHhvY1aEZSVdInG7+Q9EvSz9RrUKqgV0PP3Vz7gvqCOsUj+CxC9LB1Dc8AAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=',
    //   type: 'default',
    //   onClick: () => {
    //     this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
    //   },
    // };
  }
  getLicense(data)
  {
    // debugger;
    this.commonService.GetLicenseInfor(data.companyCode, data.license).subscribe((response: any)=>{
      if(response.success)
      {
        this.popupVisible = true;
        this.licenseInfor = response.data;
        console.log('response.data', response.data);
        // Swal.fire('License Information','Update license successfully completed','info');
      }
      else 
      {
        Swal.fire('License Information', response.message, 'warning');
      }
    }, error =>{
      Swal.fire('License Information', error, 'error');
    })
  }
  saveLicense(data)
  {
    // debugger;
     Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to apply License '+ data.license +' for user ' + data.username,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // debugger;
        let list  = [];
        list.push(data.userId);
        this.authService.SetLicenseForUser(data.companyCode, data.license, list).subscribe((response: any)=>{
          if(response.success)
          {
            Swal.fire('Update License','Update license successfully completed','info').then(()=>
            {
              window.location.reload();
            });
          }
          else
    
          {
            Swal.fire('Update License', response.message, 'warning');
          }
        }, error =>{
          Swal.fire('Update License', error, 'error');
        })
      }
    });
    
  }
  removeLicense(data)
  {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove License '+ data.license +' of user ' + data.username,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
       
        // debugger;
        let list  = [];
        list.push(data.userId);
        this.authService.RemoveLicenseForUser(data.companyCode, data.license, list ).subscribe((response: any)=>{
          if(response.success)
          {
            Swal.fire('Remove License','Remove license successfully completed','info').then(()=>{
              window.location.reload();
            });
          }
          else 
          {
            Swal.fire('Remove License', response.message, 'warning');
          }
        }, error =>{
          Swal.fire('Remove License', error, 'error');
        })
      }
    });
    
  }
  functionId = "Adm_User";
  ngOnInit() {
    // this.route
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }
    this.loadItems();
    debugger;
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
  GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return   date.getFullYear()+ '-' +  month+ '-' + (day) ;
  }
  onExporting(e) {
    const workbook = new Workbook();    
    const worksheet = workbook.addWorksheet('Main sheet');
    let nameOfRpt= 'User' ;
    var d = new Date();
    let dateFm = this.GetDateFormat(d);
  
    nameOfRpt = nameOfRpt + '_' + dateFm.replace(/\-/gi,'') ;
    exportDataGrid({
        component: e.component,
        worksheet: worksheet,
        customizeCell: function(options) {
          debugger;
            // const excelCell = options;
            const { gridCell, excelCell } = options;

            if(gridCell.rowType === 'data') {
              // debugger;
              //   excelCell.font = { color: { argb: 'FF0000FF' }, underline: true };
              //   excelCell.alignment = { horizontal: 'left' };
            }
        } 
    }).then(function() {
        workbook.xlsx.writeBuffer()
            .then(function(buffer: BlobPart) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), nameOfRpt + '.xlsx');
            });
    });
    e.cancel = true; 
  }
  @ViewChild('template', { static: false }) template;
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      widget: 'dxButton',
      options: {
        width: 136,
        icon: "add", type: "default", text: this.lguAdd,
        onClick: this.openModal.bind(this, true, null, this.template)
      }
    });
  }

  loadItems() {
    this.userService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      // loadItems
      debugger;
      if (response.success) {
        this.items = response.data;
        if(this.items!==null && this.items!==undefined && this.items?.length> 0)
        {
          this.items.forEach(user => {
            if(user?.license?.length > 0)
            {
              user.setLicense = true;
            }
            if(user?.status === 'I')
            {
              user.statusMask = 'Inactive';
            }
            if(user?.status === 'A')
            {
              user.statusMask = 'Active';
            }
          });
        }
        
        console.log(' this.items',  this.items)
      }
      else {
        this.alertify.warning(response.message);
      }
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  // userEdit: MUser;
  loadItem( userName) {
    this.userService.getItem(this.authService.getCurrentInfor().companyCode, userName ).subscribe((response: any) => {
      // loadItems
      debugger;
      if (response.success) {
        let userEdit = response.data; 
        if(userEdit!==undefined && userEdit!==null)
        {
          setTimeout(() => {
            this.openModal(this.isNew, userEdit, this.template);
          }, 40);
        }
        else
        {
          this.alertify.warning("data not found");
        }
      }
      else {
        this.alertify.warning(response.message);
      }
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  modalRef: BsModalRef;
  user: MUser;
  openModal(isNew: boolean, user: MUser, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.user = new MUser();
    }
    else {
      this.user = user;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  openStoreModal(user: MUser) {

    const initialState = {
      model: user, title: 'Item Serial',
    };
    this.modalRef = this.modalService.show(ManagementUserStoreComponent, { initialState });
    // setTimeout(() => {
    //   this.modalRef = this.modalService.show(template, {
    //     ariaDescribedby: 'my-modal-description',
    //     ariaLabelledBy: 'my-modal-title', 
    //     class: 'modal-dialog modal-dialog-centered modal-sm'
    //   });
    // });

  }
  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.userService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItems();
          this.modalRef.hide();
          // setTimeout(() => {
          //   this.openModal(this.isNew, model, this.template);
          // }, 40);
         
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      this.userService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.modalRef.hide();
          debugger;
          let user = response.data;
          this.loadItem(user.userId);
         
        }
        else {
          this.alertify.error(response.message);
        }

      }, error => {
        this.alertify.error(error);
      });
    }

  }


}
