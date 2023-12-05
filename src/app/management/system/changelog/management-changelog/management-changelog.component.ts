import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { SReleaseNote } from 'src/app/_models/system/releaseNote';
import { AuthService } from 'src/app/_services/auth.service';
import { ReleaseNoteService } from 'src/app/_services/common/release-note.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-management-changelog',
  templateUrl: './management-changelog.component.html',
  styleUrls: ['./management-changelog.component.scss']
})
export class ManagementChangelogComponent implements OnInit {

  releaseNote: SReleaseNote;
  items: SReleaseNote[];
  pagination: Pagination = null;
  userParams: any = {};
  pageNumber = 1;
  pageSize = 50;
  versionList: any = [];
  selectedVersion = "";
  lgu = "vi";
  constructor(private releaseSerrvice: ReleaseNoteService,   private modalService: BsModalService, public authService: AuthService,
    private alertify: AlertifyService, private route: ActivatedRoute) {

      const lgu = localStorage.getItem('language');
      if (lgu === "vi") {
        this.lgu = "vi";
      } else
       {
        this.lgu = "en";
      }  
     }
  scrollToBottomList()
  {
    
      setTimeout(() => {
        const scrollTo = document.querySelector(".versionSelected");
        if (scrollTo) {
          // 
        
              // debugger;
            scrollTo.scrollIntoView({behavior: 'smooth', block: 'center' });
            // this.scrollToBottomFix();
          // this.basketService.changeBasketResponseStatus(true);
        }
         
      }, 200)
    
   
  }
 
  ngOnInit() {
    // debugger;
    // this.route.data.subscribe(data => {
  
    //   let items = data['logs'].result?.data;
    //   this.pagination = data['logs'].pagination;
    //   debugger;
     
    //   this.userParams.keyword = '';
    //   this.userParams.orderBy = 'byName';

    //   console.log(' this.versionList',  this.versionList);
    //   // data['items']
    // });
    // this.loadItemPagedList(); 
    this.loadItems();
  }
  loadItems()
  {
    this.releaseSerrvice.getAll(this.authService.storeSelected().companyCode)
    .subscribe((res: any) => {
     
      if(res.success)
      {
        if(res.data?.length > 0)
        {
          debugger;
          this.items = res.data.filter(x=> (x.status ?? 'I') !== 'I'); 
          if(this.items?.length > 0)
          { 
  
            this.versionList= [];
            this.items.forEach((item) => {
              if(item?.status ?? 'I' !== 'I')
              {
                let check  = this.versionList.find(x=>x.version === item.version);
              
                if( check=== null ||  check=== undefined )
                {
                  let model:any = {};
                  model.version = item.version;
                  model.description = item?.versionDescription;
                  model.releaseTime = item?.versionReleaseTime;
                  model.lines = [];
                  // model.statusGroup = [];
                  model.lines.push(item);
                  this.versionList.push(model);
                }
                else
                {
                  check.lines.push(item);
                }
              }
             
            });

            if( this.versionList?.length > 0)
            {
        
    
              this.versionList.forEach(version => {
                var statusGroups = version.lines.reduce(function (obj, item) {
        
                  obj[item.status] = obj[item.status] || [];
                  obj[item.status].status = item.status; 
                  obj[item.status].push({
                    
                    id: item.id,
                    companyCode: item.companyCode,
                    version: item.version,
                    description: item.description,
                    releaseTime: item.releaseTime,
                    releaseContent: item.releaseContent,
                    releaseContentForeign: item.releaseContentForeign,
                    customF1: item.customF1,
                    customF2: item.customF2,
                    customF3: item.customF3,
                    customF4: item.customF4,
                    customF5: item.customF5,
                    createdBy: item.createdBy,
                    createdOn: item.createdOn,
                    modifiedBy: item.modifiedBy,
                    modifiedOn:item.modifiedOn,
                    status: item.status,
        
                  });
        
                  return obj;
                }, {});
                
                let responseProps = Object.keys(statusGroups);
                
                let statusResponse = [];
          
                for (let prop of responseProps) {
        
                  statusResponse.push(statusGroups[prop]);
                } 
                version.statusGrp = statusResponse;
               
              });
              debugger;
              // this.versionList = this.versionList.sort((a, b) => a.releaseTime !== b.releaseTime ? a.releaseTime < b.releaseTime ? -1 : 1 : 0);
              this.versionList = this.sortByStartDate(this.versionList);
            } 
          }
  
  
       
        }
        else
        {
          Swal.fire({
            icon: 'warning',
            title: 'Release Note',
            text: "Data not found"
          });
        }
        
      }
      else
      {
        this.alertify.error(res.message);
      }
     
    }, error => {
      this.alertify.error(error);
    });

  
  }
  private getTime(date?) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(array: SReleaseNote[]) {
    return array.sort((a: SReleaseNote, b: SReleaseNote) => {
      return this.getTime(b.releaseTime) - this.getTime(a.releaseTime);
    });
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
  listSelectionChanged = (e) => {
    //
    setTimeout(() => {
      if (e.addedItems.length > 0) { 
        debugger;
        this.selectedVersion = e.addedItems[0].version; 
        this.scrollToBottomList();
      }
    }, 500);
  };

  loadItemPagedList() {
    this.releaseSerrvice.getItemPagedList(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((res: PaginatedResult<SReleaseNote[]>) => {
        debugger;
        this.items = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }
  modalRef: BsModalRef; 
  openModal(model: SReleaseNote, template: TemplateRef<any>) {
    debugger; 
    this.releaseNote = model;
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, {
        ariaDescribedby: 'my-modal-description',
        ariaLabelledBy: 'my-modal-title',
        class: 'modal-dialog modal-dialog-centered modal-sm'
      });
    });

  }


}
