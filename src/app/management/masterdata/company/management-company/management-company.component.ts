import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvService } from 'src/app/env.service';
import { MCompany } from 'src/app/_models/company';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CompanyService } from 'src/app/_services/data/company.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-management-company',
  templateUrl: './management-company.component.html',
  styleUrls: ['./management-company.component.scss']
})
export class ManagementCompanyComponent implements OnInit {


  url = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  // url =  environment.imageUrlCompany;
  list: MCompany[];
  userParams: any = {};
  modalRef: BsModalRef;
  company: MCompany;
  isNew: boolean = false;
  functionId = "Adm_Company";
  lguAdd: string = "Add";
  openLicenseModal(template: TemplateRef<any>)
  {
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }
  openModal(isNew: boolean, company: MCompany, template: TemplateRef<any>) {
    debugger;
    this.isNew = isNew;
    if (isNew) {
      this.company = new MCompany();
    }
    else {
      this.company = company;
    }
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  storeSelected: MStore;
  constructor(private companyService: CompanyService, private alertify: AlertifyService, private authService: AuthService,
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
    this.url = this.url + environment.imageUrl;
    this.url = this.url.replace("api/wwwroot","");
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }

    // this.selectedDate = new Date();
    this.storeSelected = this.authService.storeSelected();

    this.loadItems();
  }

  loadItems() {

    this.companyService.getAll().subscribe((response: any) => {
      // loadItems
      // debugger;

      this.list = response.data;
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

  getItem(item: MCompany) {
    // this.routeNav.navigate(["shop/bills", order.transId, order.companyCode, order.storeId]);
    //  this.router.navigate(["admin/masterdata/item", item.itemCode]);
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
