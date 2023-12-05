import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StoreWareHouseViewModel } from 'src/app/_models/viewmodel/StoreWareHouseViewModel';
import { StorewarehouseService } from 'src/app/_services/data/storewarehouse.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-store-whs-setting',
  templateUrl: './management-store-whs-setting.component.html',
  styleUrls: ['./management-store-whs-setting.component.scss']
})
export class ManagementStoreWhsSettingComponent implements OnInit {
  storeId:string ='';
  isNew: boolean = false;
  lguAdd: string = "Add";
  modalRef: BsModalRef;
  storeWareHouse: StoreWareHouseViewModel[];
  openModal(isNew: boolean, store: string, template: TemplateRef<any>) {
    this.isNew = isNew;
    if(this.storeWareHouse.length>0 && this.isNew ==true)
    return
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }
  constructor(private route: ActivatedRoute,private alertify: AlertifyService,
    private modalService: BsModalService,private storewarehouseService:StorewarehouseService) {
      const lgu = localStorage.getItem('language');
      if (lgu === "vi") {
        this.lguAdd = "Thêm";
      } else if (lgu === "en") {
        this.lguAdd = "Add";
      } else {
        console.log("error");
      }
     }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.storeId = data['storeid'];
      this.loaddata();
    })
  }
  loaddata(){
    this.storewarehouseService.getAllStore(this.storeId).subscribe((res:any)=>{
      this.storeWareHouse = res.data;
    })
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
  deleteData(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.storewarehouseService.Delete(this.storeId).subscribe((response: any) => {
          if (response.success) {
            this.alertify.success('Delete completed successfully.');
            this.loaddata();
            this.modalRef.hide();
          }
          else {
            this.alertify.error(response.message);
          }

        }, error => {
          this.alertify.error(error);
        });
      }
    });

  }
  updateModel(model){
    if (this.isNew) {
      // model.storeId = this.storeId;
      this.storewarehouseService.create(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Create completed successfully');
          this.loaddata();
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
      // model.storeId = this.storeId;
      this.storewarehouseService.update(model).subscribe((response: any) => {
        if (response.success) {
          this.alertify.success('Update completed successfully.');
          this.loaddata();
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
