import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LicensePlateHearder, LicensePlateLine } from 'src/app/_models/licensePlatemodel';
import { MStore } from 'src/app/_models/store';
import { AuthService } from 'src/app/_services/auth.service';
import { CommonService } from 'src/app/_services/common/common.service';
import { ExcelService } from 'src/app/_services/common/excel.service';
import { LicensePlateService } from 'src/app/_services/data/LicensePlate.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
@Component({
  selector: 'app-management-licensePlate-add',
  templateUrl: './management-licensePlate-add.component.html',
  styleUrls: ['./management-licensePlate-add.component.css']
})
export class ManagementLicensePlateAddComponent implements OnInit {


  currentValue: Date = new Date();
  LicensePlate: LicensePlateHearder;
  lines: LicensePlateLine[];
  storeSelected: MStore;
  mode: string;
  id: string;
  isNew = false;
  dateFormat = "";
  movementTypes = [];
  // ListNullTax: ErrorList[] = [];
  arrWhsFrm = [];
  configStorage: boolean = true;
  minnumber: number = 1;
  manageStock = "false";
  inventoryWitouthBOM = "true";
  qtyPattern: any = '';
  inputWithoutConfig = "true";
  lguAdd: string = "Add";
  isSave = true;


  constructor(private excelSrv: ExcelService,  private modalService: BsModalService,
 public commonService: CommonService, public authService: AuthService, private alertifyService: AlertifyService,
    private route: ActivatedRoute, private router: Router,private LicensePlateService: LicensePlateService) {
      this.storeSelected = this.authService.storeSelected();
    this.LicensePlate = new LicensePlateHearder();

    // this.getFilteredUom = this.getFilteredUom.bind(this);
  }
  functionId = "Adm_GoodIssue";
  ngAfterViewInit() {
    console.log("afterinit");

  }
  dataSourceItem: any;
  canEdit = false;
  canAdd = false;
  checkFormatQty(){
    let format = this.authService.loadFormat();
    if(format !==null || format !==undefined)
    {
      for(let i =0;i<parseInt(format.qtyDecimalPlacesFormat.toString());i++)
      {
        this.minnumber = this.minnumber/10;
      }
      let inputWithoutConfig = this.authService.getGeneralSettingStore(this.authService.getCurrentInfor().companyCode, this.authService.storeSelected().storeId).find(x => x.settingId === 'InputWithoutConfig');
      if (inputWithoutConfig !== null && inputWithoutConfig !== undefined) {
        
        this.inputWithoutConfig = inputWithoutConfig.settingValue;
      }
      if(this.inputWithoutConfig==='false')
      {
        this.qtyPattern = '^-?[0-9]\\d*(\\.\\d{1,'+ format.qtyDecimalPlacesFormat.toString()+'})?$';
      }
    }
  }
  ngOnInit() {
    this.checkFormatQty();
    let check = this.authService.checkRole(this.functionId, '', 'V');
    if (check === false) {
      this.router.navigate(["/admin/permission-denied"]);
    }

    else {
      debugger;
      this.canAdd = this.authService.checkRole(this.functionId, '', 'I');
      this.canEdit = this.authService.checkRole(this.functionId, '', 'E');
      this.dateFormat = this.authService.loadFormat().dateFormat;
      // console.log(this.dateFormat);
      // debugger;
      this.route.params.subscribe(data => {
        this.mode = data['m'];
        this.id = data['id'];
      })
      if (this.mode === 'e') {

        this.LicensePlateService.getById(this.id, this.storeSelected.companyCode).subscribe((response: any) => {

          if (response.success) {
            this.LicensePlate = response.data;
            this.lines = response.data.lines;

            // this.getFilteredUom = this.getFilteredUom.bind(this.lines);
            this.isNew = false;
          }
          else {
            this.alertifyService.warning(response.message);
          }

        });
      }
      else {
        this.LicensePlate = new LicensePlateHearder();
        this.lines = [];
        // console.log(this.goodissue);
        this.isNew = true;
        // this.loadUom();
      }
    }


  }




  // PrintDetail(data) {
  //   console.log("data", data);
  //   this.router.navigate(["admin/goodsissue/print", data.invtid]).then(() => {
  //     // window.location.reload();
  //   });
  // }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
