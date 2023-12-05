import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { SReleaseNote } from 'src/app/_models/system/releaseNote';
import { ReleaseNoteService } from 'src/app/_services/common/release-note.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';

@Component({
  selector: 'app-management-release-list',
  templateUrl: './management-release-list.component.html',
  styleUrls: ['./management-release-list.component.scss']
})
export class ManagementReleaseListComponent implements OnInit {

  items: SReleaseNote[];
  pagination: Pagination;
  userParams: any = {};

  constructor(private releaseSerrvice: ReleaseNoteService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadItemPagedList();
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


}
