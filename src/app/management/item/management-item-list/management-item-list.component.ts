import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemSearch } from 'src/app/shop/shop-customer/shop-customer.component';
import { Item } from 'src/app/_models/item';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from 'src/app/_services/auth.service';
import { ControlService } from 'src/app/_services/data/control.service';
import { ItemService } from 'src/app/_services/data/item.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-item-list',
  templateUrl: './management-item-list.component.html',
  styleUrls: ['./management-item-list.component.scss']
})
export class ManagementItemListComponent implements OnInit {

  items: Item[];
  pagination: Pagination;
  userParams: any = {};
  functionIdFilter = "Cpn_ItemFilter";
  controlList: any[];
  groupControlList = {};
  model: ItemSearch;
  customerId = "";
  customerSearchForm: FormGroup;
  source = "Local";


  constructor(private itemService: ItemService, private alertify: AlertifyService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private controlService: ControlService, private authService: AuthService) { }

  ngOnInit() {
    // this.route
    // this.loadItems();
    this.getControlList();
    debugger;
    // this.pagination.currentPage = 1; this.pagination.itemsPerPage = 5;
    // this.loadItemPagedList();
    // this.route.data.subscribe(data => {
    //   debugger;
    //   this.items = data['items'].result;
    //   this.pagination = data['items'].pagination;
    //   // debugger;

    //   this.userParams.keyword = '';
    //   this.userParams.orderBy = 'byName';

    //   // data['items']
    // });
    
  }
  filterBy(txtFilter: any) {
    debugger;
    this.userParams.keyword = txtFilter;
    this.loadItemPagedList();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadItemPagedList();
  }
  loadItems() {
    this.itemService.getItemPagedList().subscribe((res: PaginatedResult<Item[]>) => {
      // loadItems
      // debugger;
      this.items = res.result;
      // console.log(this.items);
      // console.log(this.items);
    }, error => {
      this.alertify.error(error);
    });
  }
  loadItemPagedList() {
    this.itemService.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<Item[]>) => {
        debugger;
        this.items = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

   
  getControlList() {
    this.controlService.getControlByFunction(this.authService.getCurrentInfor().companyCode, this.functionIdFilter).subscribe((response: any) => {
      console.log("response", response);
      if (response.data.length > 0) {
        // debugger;
        this.controlList = response.data.filter(x => x.controlType !== 'Button');
        // this.controlList = this.controlList.sort((a, b) => a.orderNum > b.orderNum ? 1 : -1); 

        // console.log("controlList", this.controlList);
        // console.log("response", response);
        let group: any = {};
        response.data.forEach(item => {
          if (item.controlType === "DateTime") {
            // debugger;
            if (this.model[item.controlId] === null || this.model[item.controlId] === undefined) {
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: null, disabled: false });
            }
            else {
              // invalidDate.setDate(today.getDate());
              let date = new Date(this.model[item.controlId]);
              this.model[item.controlId] = new Date(this.model[item.controlId]);
              // group[item.controlId] = [this.model[item.controlId] , ];
              group[item.controlId] = new FormControl({ value: date, disabled: false });
            }
          }
          else {
            group[item.controlId] = [''];

          }
        });

        this.customerSearchForm = this.formBuilder.group(group);

        if (this.controlList.length > 0) {
         
          var groups = this.controlList.reduce(function (obj, item) {
            obj[item.controlType] = obj[item.controlType] || [];

            obj[item.controlType].push({
              controlId: item.controlId,
              companyCode: item.companyCode,
              controlName: item.controlName,
              functionId: item.functionId,
              action: item.action,
              controlType: item.controlType,
              createdBy: item.createdBy,
              createdOn: item.createdOn,
              optionName: item.optionName,
              require: item.require,
              optionKey: item.optionKey,
              custom1: item.custom1,
              custom2: item.custom2,
              optionValue: item.optionValue,
              status: item.status,
              orderNum: item.orderNum,
            
            });
            return obj;
          }, {});
          this.groupControlList = Object.keys(groups).map(function (key) {
            let indexKey = 0;
            if (key === "CheckBox") {
              indexKey = 6;
            } else if (key === "DateTime") {
              indexKey = 2;
            } else if (key === "TextBox") {
              indexKey = 3;
            } else if (key === "DropDown") {
              indexKey = 4;
            }
            return { controlType: key, arrayGroup: groups[key], index: indexKey, len: groups[key].length };
          }).sort((a, b) => a.index > b.index ? 1 : -1);

          this.route.params.subscribe(data => {
            // this.customerId = data['id'];
            // if (this.customerId === null || this.customerId === undefined) {
            //   this.customerId = "";
            // }
            // if (this.source === 'Capi') {
            //   // this.customers = null;

            // }
            // else {
            //   // this.source = "Local";


            //   // this.searchItem();
            // }

          });

          console.log("this.groupControlList", this.groupControlList);
        }
      }
    });
  }


}
