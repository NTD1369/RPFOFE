import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvService } from 'src/app/env.service';
import { LicenseInfor, SLicense } from 'src/app/_models/license';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-license-edit',
  templateUrl: './management-license-edit.component.html',
  styleUrls: ['./management-license-edit.component.scss']
})
export class ManagementLicenseEditComponent implements OnInit {

  popupVisible = false;
  url = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  // url =  environment.imageUrlCompany;
  licenseList: SLicense[];
  userParams: any = {};
  modalRef: BsModalRef;
  license: SLicense;
  isNew: boolean = false;
  functionId = "Adm_Company";
  lguAdd: string = "Add";

  // openModal(isNew: boolean, company: MCompany, template: TemplateRef<any>) {
  //   debugger;
  //   this.isNew = isNew;
  //   if (isNew) {
  //     this.company = new MCompany();
  //   }
  //   else {
  //     this.company = company;
  //   }
  //   setTimeout(() => {
  //     this.modalRef = this.modalService.show(template, {
  //       ariaDescribedby: 'my-modal-description',
  //       ariaLabelledBy: 'my-modal-title',
  //       class: 'modal-dialog modal-dialog-centered modal-sm'
  //     });
  //   });

  // }
  storeSelected: MStore;
  licenseInfor: LicenseInfor;
  getLicense(data)
  {
    // debugger;
    this.commonService.GetLicenseInfor(data.companyCode, data.licenseCode).subscribe((response: any)=>{
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
  constructor(private companyService: CompanyService, private alertify: AlertifyService, public authService: AuthService, private commonService: CommonService,
    private router: Router, private modalService: BsModalService, private route: ActivatedRoute, public env: EnvService) {
    // Chuyển đổi ngôn ngữ
    const lgu = localStorage.getItem('language');
    console.log("lgu", lgu);
    if (lgu === "vi") {
      this.lguAdd = "Thêm";
    } else if (lgu === "en") {
      this.lguAdd = "Add";
    } else {
      console.log("error");
    }

  }
  selectedDate;
  ngOnInit() {
    // this.url = this.url + environment.imageUrl;
    // this.url = this.url.replace("api/wwwroot","");
    // let check = this.authService.checkRole(this.functionId, '', 'V');
    // if (check === false) {
    //   this.router.navigate(["/admin/permission-denied"]);
    // }

    // this.selectedDate = new Date();
    this.storeSelected = this.authService.storeSelected();

    this.loadItems();
  }

  loadItems() {
    
    this.authService.Get_TokenLicense(this.authService.getCompanyInfor().companyCode,'','').subscribe((response: any) => {
      // loadItems
      // debugger;
      if(response.success)
      {
        this.licenseList = response.data;
      }
      else
      {
        Swal.fire('License', response.message,'warning');
      }
     
      // this.list.forEach(line => {
      //   if(line.logo!==null&& line.logo!==undefined )
      //   {
      //     line.logo= this.url +'/'+  line.logo;
      //   } 
      // });

      // console.log(this.merchandises);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }

  

  @ViewChild('template', { static: false }) template;
  // onToolbarPreparing(e) {
  //   e.toolbarOptions.items.unshift({
  //     location: 'before',
  //     widget: 'dxButton',
  //     options: {
  //       width: 136,
  //       icon: "add", type: "default", text: this.lguAdd,
  //       onClick: this.onFileChange.bind(this, true, null, this.template)
  //     }
  //   });
  // }
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    //  if (target.files.length === 0) {
    //   return;
    // }
    let fileToUpload = <File>target.files[0];
    debugger;
      //     next: (event) => {
    //     if (event.type === HttpEventType.UploadProgress)
    //       this.progress = Math.round(100 * event.loaded / event.total);
    //     else if (event.type === HttpEventType.Response) {
    //       this.message = 'Upload success.';
    //       this.onUploadFinished.emit(event.body);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => console.log(err)
    this.commonService.uploadFile(fileToUpload, this.authService.getCurrentInfor().companyCode)
      .subscribe({
        next: (event) => {
        if (event.type === HttpEventType.UploadProgress)
        {

        }
          
        else if (event.type === HttpEventType.Response) 
        {
           let response: any =  event.body;  
             if(response.success)
            {
              Swal.fire('Upload License', 'Upload License Successfully Completed','success'); 
              this.loadItems();
            }
            else
            {
              Swal.fire('Upload License', response.message,'warning');
            }

        }
      },
      error: (error) =>{
       console.log('Upload License Error', error);
        Swal.fire('Upload License',"Can't Upload License",'error')
      } 
      // console.log(error)
    });
          
    
    
    // .subscribe((response: any)=>{
    //   debugger;
    //   if(response.success)
    //   {
    //     Swal.fire('Upload License', 'Upload License Successfully Completed','success'); 
    //   }
    //   else
    //   {
    //     Swal.fire('Upload License', response.message,'warning');
    //   }

    // }, error => {
    //      console.log('Upload License Error', error);
    //     Swal.fire('Upload License','','error')
    // })
 
  }
  updateModel(model) {
    debugger;
    if (this.isNew) {

      this.companyService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loadItems();
          this.modalRef.hide();
        }
        else {
          this.alertify.error(response.message);
        }
      }, error => {
        this.alertify.error(error);
      });
    }
    else {
      this.companyService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.modalRef.hide();
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
