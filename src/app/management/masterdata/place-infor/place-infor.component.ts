import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MPlaceInfor } from 'src/app/_models/placeinfor';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from 'src/app/_services/auth.service';
import { PlaceService } from 'src/app/_services/data/place.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';
import { EmunPermission } from 'src/app/_models/emun/emun-permission';
@Component({
  selector: 'app-place-infor',
  templateUrl: './place-infor.component.html',
  styleUrls: ['./place-infor.component.css']
})
export class PlaceInforComponent implements OnInit {
  public fileToUpload: any;
  public imageUrl: any;
  public isNew: boolean = false;
  public place: MPlaceInfor;
  public functionId: string = "Adm_PlaceInfor";
  public message: string = "";
  public sourceData;
  public loginInfor;
  public storeId;
  public placeId;
  public storeList;
  public modalRef: BsModalRef;

  listStatus: any = [
    { name: "Active", value: "A" },
    { name: "In Active", value: "I" }

  ]

  statusDefault: any = [
    { name: "Yes", value: "Y" },
    { name: "No", value: "N" }

  ]

  listDonVi: any = [
    { name: "centimet", value: "cm" },
    { name: "decimet", value: "dm" },
    { name: "met", value: "m" }
  ]


  public listSeat: any = [
    { name: "2", value: 2 },
    { name: "4", value: 4 },
    { name: "6", value: 6 },
    { name: "8", value: 8 },
    { name: "10", value: 10 },
    { name: "12", value: 12 },
    { name: "14", value: 14 },
    { name: "16", value: 16 },
    { name: "18", value: 18 },
    { name: "20", value: 20 },
    { name: "22", value: 22 },
    { name: "24", value: 24 },
    { name: "26", value: 26 },
    { name: "28", value: 28 },
    { name: "30", value: 30 }
    
  ]
  @ViewChild('template', { static: false }) template;

  constructor(private storeServies: StoreService, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
    public authService: AuthService, private placeService: PlaceService, private alertity: AlertifyService, private modalService: BsModalService) {
    this.place = new MPlaceInfor();
    this.loginInfor = this.authService.getCurrentInfor();
  }

  ngOnInit() {
    let isCheckRole = this.authService.checkRole(this.functionId, '', EmunPermission.View);
    if (!isCheckRole) { this.router.navigate(["/admin/permission-denied"]); }
    this.firstPageLoading();
  }

  firstPageLoading() {
    this.storeId = this.authService.storeSelected().storeId;
    this.loadInfoItem();
    this.loadStore();
  }

  loadInfoItem() {
    this.placeService.getAll(this.loginInfor.companyCode, this.storeId, "").subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data;
      }
      else {
        this.alertity.warning(res.message)
      }
    })
  }

  loadStore() {
    this.storeServies.getAll(this.loginInfor.companyCode).subscribe((respon: any) => {
      if (respon.success) {
        this.storeList = respon.data
        console.log("respon", this.storeList);
      }
      else {
        this.alertity.warning(respon.message)
      }
    })
  }


  //icon sử dụng : https://fontawesome.com/icons/print?f=sharp&s=light
  onToolbarPreparing(e) {
    if (this.authService.checkRole(this.functionId, '', 'I')) {
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "print", type: "success", text: 'Add Print',
          onClick: this.btnBackToPrint.bind(this, this.template, null)
        }
      });
      e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 136,
          icon: "add", type: "default", text: 'Add',
          // true, null, 
          onClick: this.createModal.bind(this, this.template, null)
        }
      });
     
    }
  }

  btnBackToPrint() {
    this.router.navigate(['/admin/masterdata/settingPrint']);
  }


  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    //Show image preview
    var mimeType = this.fileToUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
      this.place.urlImage = reader.result as any;
    }

    this.place.urlImage = reader.result as any;
  }

  createModal(template: TemplateRef<any>, newPlace) {
    if (newPlace !== null) {
      this.place = newPlace;
      this.isNew = false;
    } else {
      this.place = new MPlaceInfor();
      this.place.storeId = this.storeId;
      this.place.status = "A";
      this.isNew = true;
    }

    if (this.place.urlImage !== null && this.place.urlImage !== undefined && this.place.urlImage !== '') {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.place.urlImage}`);;
    }
    else {
      this.imageUrl = null;
    }

    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });
  }

  saveInfo() {
    this.place.companyCode = this.loginInfor.companyCode;
    this.place.createdBy = this.loginInfor.username;
    this.place.modifiedBy = this.loginInfor.username;

    if (this.place.urlImage !== null && this.place.urlImage !== undefined && this.place.urlImage !== '') {
      this.place.urlImage = this.place.urlImage.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '').replace('data:image/jpg;base64,', '');
    }

    this.createOrUpdate(this.isNew);
  }

  createOrUpdate(isCreateOrUpdate: boolean) {
    isCreateOrUpdate ?
      this.placeService.create(this.place).subscribe((respon: any) => {
        if (respon.success) {
          this.alertity.success("Create completed successfully.");
          this.modalRef.hide();
          this.loadInfoItem()
        }
        else {
          this.alertity.warning(respon.message);
        }
      })
      :
      this.placeService.update(this.place).subscribe((respon: any) => {
        if (respon.success) {
          this.alertity.success("Update completed successfully.");
          this.loadInfoItem();
          this.modalRef.hide();
        }
        else {
          this.alertity.warning(respon.message)
        }
      })
  }

  delele(model, placeName) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Bạn có chắc chắn muốn xóa ' + placeName + " không?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.placeService.delete(model).subscribe((response: any) => {
          if (response.success) {
            this.alertity.success('Delete completed successfully.');
            this.loadInfoItem();
          }
          else {
            this.alertity.error(response.message);
          }
        }, error => {
          this.alertity.error(error);
        });

      }
    })
  }

  moveTable(placeNew) {
    this.router.navigate(["admin/masterdata/table-place/", placeNew.storeId, placeNew.placeId]);
  }

  moveTableDesign(placeNew) {
    this.router.navigate(["admin/table-design/", placeNew.storeId, placeNew.placeId]);

  }

  moveTableCashier(placeNew) {
    this.router.navigate(["admin/table-cashier/", placeNew.storeId, placeNew.placeId]);

  }
}

