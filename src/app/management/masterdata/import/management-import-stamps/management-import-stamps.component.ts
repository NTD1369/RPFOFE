import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { distinct } from 'rxjs/operators';
import { ShopApprovalInputComponent } from 'src/app/shop/tools/shop-approval-input/shop-approval-input.component';
import { MStore } from 'src/app/_models/store';
import { ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { AuthService } from 'src/app/_services/auth.service';
import { BasketService } from 'src/app/_services/common/basket.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { StoreService } from 'src/app/_services/data/store.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { PermissionService } from 'src/app/_services/system/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-import-stamps',
  templateUrl: './management-import-stamps.component.html',
  styleUrls: ['./management-import-stamps.component.scss']
})
export class ManagementImportStampsComponent implements OnInit {


  isResult = false;
  store: string = '';
  storeId: string = '';
  functionId = "Adm_Shop";
  modalRef: BsModalRef;
  onOffSave: boolean = false;

  value: any[] = [];
  arrNewItemStamps = [];
  importContent: MItemStamps[] = [];
  clipBoardItem: MItemStamps[] = [];
  storeList: MStore[] = [];
  arrNewShowGrid = [];
  arrNewShowGridErr = [];
  arrDataItem = [];
  getDataAllItem: ItemViewModel[] = [];



  constructor(private commonService: CommonService, private excelSrv: ExcelService, public authService: AuthService, public storeService: StoreService,
    private alertifyService: AlertifyService, private modalService: BsModalService, private permissionService: PermissionService, private itemService: ItemService,
    private basketService: BasketService) {
  }

  downloadTemplate() {
    this.commonService.download('M_Stamps.xlsx');
  }
  ngOnInit() {
    this.loadStore();
  }

  loadStore() {
    this.storeService.getAll(this.authService.getCurrentInfor().companyCode).subscribe((response: any) => {
      if (response.success) {
        this.storeList = response.data;
        this.storeId = this.authService.storeSelected().storeId
        console.log("this.storeList", this.storeList);
      }
      else {
        this.alertifyService.warning(response.message);
      }
    })
  }

  StoreChange(event) {
    // console.log("event", event);
    // this.clipBoardItem = [];
    // this.arrNewItemStamps = [];
  }

  // Import data from file excel
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  onFileChange(evt: any) {
    // debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // debugger;
      const bstr: string = e.target.result;
      const dataHeader = <any[]>this.excelSrv.importFromFile(bstr, 0);


      const header: string[] = Object.getOwnPropertyNames(new MItemStamps());

      const excelHeader = dataHeader[0];
      const importedDataHeader = dataHeader.slice(1);//.slice(1, -2); 

      this.importContent = importedDataHeader.map(arr => {
        // debugger;
        const obj = {};
        for (let i = 0; i < excelHeader.length; i++) {
          for (let j = 0; j < header.length; j++) {
            const ki = this.capitalizeFirstLetter(excelHeader[i]);
            const kj = this.capitalizeFirstLetter(header[j]);
            // debugger;
            if (ki.toLowerCase() === kj.toLowerCase()) {
              // obj[header[j]] = arr[i].toString();
              if(arr[i]!==null && arr[i]!==undefined)
              {
                obj[header[j]] = arr[i].toString();
              }
              else
              {
                obj[header[j]] = null;
              }
            }
          }
        }


        return <MItemStamps>obj;
      })

      if (this.importContent.length > 0) {
        const arrExcel = [];
        const arrDataFilter = this.importContent.filter(s => s.itemCode != undefined);
        for (let i = 0; i < arrDataFilter.length; i++) {
          let el = arrDataFilter[i];
          const uomName = el.uomName != undefined ? el.uomName : '';
          const barcode = el.barCode != undefined ? el.barCode : '';
          this.itemService.getItemViewList(this.authService.storeSelected().companyCode, this.storeId, el.itemCode, uomName, barcode, '', '', '').subscribe((response: any) => {
            if (response.data.length > 0) {
              response.data.forEach(element => {
                arrExcel.push({
                  keyId: element.keyId,
                  itemCode: element.itemCode,
                  itemName: element.itemName,
                  uomName: element.uomName,
                  priceAfterTax: element.priceAfterTax,
                  barCode: element.barCode,
                  numberofPrints: el.numberofPrints != undefined ? el.numberofPrints : 1
                });
              });
              console.log("arrExcel", arrExcel);
              this.DataProcessing(arrExcel);
            } else {
              console.log("el.itemCode", el.itemCode)
              
              this.arrNewShowGridErr.push(el.itemCode);
              
            }
          });
        }
      }
    }
  }


  PushGridPrint(arrPush) {
    this.arrNewItemStamps = [];
    arrPush.forEach(item => {
      for (let index = 0; index < item.numberofPrints; index++) {
        this.arrNewItemStamps.push({
          itemName: item.itemName,
          itemCode: item.itemCode,
          uomName: item.uomName,
          priceAfterTax: Intl.NumberFormat('en-US').format(item.priceAfterTax),
          barCode: item.barCode,
        });
      }
    });
  }

  showFilter(template: TemplateRef<any>) {
    let checkAction = this.authService.checkRole(this.functionId, 'btnSearchItem', 'V');
    let checkApprovalRequire = this.authService.checkRole(this.functionId, 'btnSearchItem', 'A');
    if(checkApprovalRequire !== null && checkApprovalRequire !== undefined && checkApprovalRequire === true)
    {
      checkAction = false;
    }
    if (checkAction) {
      setTimeout(() => {
        this.modalRef = this.modalService.show(template, {
          ariaDescribedby: 'my-modal-description',
          ariaLabelledBy: 'my-modal-title',
          class: 'modal-dialog modal-dialog-centered modal-sm'
        });
      });
    }
    else {
      // const initialState = {
      //   title: 'Permission denied',
      // };
      let permissionModel= { functionId: this.functionId, functionName: "Item Filter", controlId: 'btnSearchItem', permission: 'V'};
      const initialState = {
          title: 'Item Filter - ' + 'Permission denied', 
          freeApprove : true,
          permissionModel : permissionModel
      };
      let modalApprovalRef = this.modalService.show(ShopApprovalInputComponent, {
        initialState,
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-xl medium-center-modal'
        // class: 'modal-dialog modal-dialog-centered modal-xl medium-center-modal'
      });
      modalApprovalRef.content.outEvent.subscribe((received: any) => {
        if (received.isClose) {
          modalApprovalRef.hide();
        }
        else {
          setTimeout(() => {
            this.modalRef = this.modalService.show(template, {
              ariaDescribedby: 'my-modal-description',
              ariaLabelledBy: 'my-modal-title',
              class: 'modal-dialog modal-dialog-centered modal-sm'
            });
          });
          modalApprovalRef.hide();

          // let code = (received.customCode ?? '');
          // this.permissionService.checkApproveFunctionByUser(this.authService.getCurrentInfor().companyCode, received.user, received.pass, code, this.functionId, 'btnSearchItem', 'V').subscribe((response: any) => {
          
          //   if (response.success) {
          //     let note = (received.note ?? '');
          //     if (note !== null && note !== undefined && note !== '') {
          //       this.basketService.changeNote(note).subscribe((response) => {
  
          //       });
          //       this.alertifyService.success('Set note successfully completed.');
          //     }
            
          //   }
          //   else {
          //     Swal.fire({
          //       icon: 'warning',
          //       title: 'Remove item',
          //       text: response.message
          //     });
          //   }
          // })

        }

      });
    }

  }

  DataProcessing(arrData) {
    arrData.forEach(el => {
      this.arrDataItem.push({
        keyId: el.keyId,
        itemCode: el.itemCode,
        itemName: el.itemName,
        uomName: el.uomName,
        priceAfterTax: el.priceAfterTax,
        barCode: el.barCode,
        numberofPrints: el.numberofPrints != undefined ? el.numberofPrints : 1
      });
    });

    // check trùng keyId
    var uniqueArray = this.arrDataItem
      .map(v => v['keyId'])
      .map((v, i, array) => array.indexOf(v) === i && i)
      .filter(v => this.arrDataItem[v])
      .map(v => this.arrDataItem[v]);
    this.arrNewShowGrid = uniqueArray;
    this.PushGridPrint(this.arrNewShowGrid);
  }

  addItemToBasketX(receivedEntry) {
    // map file excel && add item
    if (receivedEntry.length > 0) {
      this.DataProcessing(receivedEntry);
    }
    this.modalRef.hide();
  }

  saveGrid() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      console.log("save excel", result);
      if (result.value) {
        this.onOffSave = true;
        if (this.arrNewShowGrid.length > 0) {
          this.PushGridPrint(this.arrNewShowGrid);
        }
      }
    });

  }

  PrintPage() {
    window.print();
  }


}





export class MItemStamps {
  keyId: string = "";
  barCode: string = "";
  itemName: string = "";
  itemCode: string = "";
  uomName: string = "";
  uomCode: string = "";
  priceAfterTax: number = 0;
  numberofPrints: number = 1;
}