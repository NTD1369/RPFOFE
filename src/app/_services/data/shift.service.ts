import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { PaginatedResult } from 'src/app/_models/pagination';
import { TSalesHeader } from 'src/app/_models/tsaleheader';
import { TShiftHeader } from 'src/app/_models/tshiftheader';
import { ShiftVM } from 'src/app/_models/viewmodel/shiftViewModel';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { AlertifyService } from '../system/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

   // baseUrl = environment.apiUrl;
   baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  private shiftHeader = new BehaviorSubject<TShiftHeader>(null);
  shiftHeader$ = this.shiftHeader.asObservable();
  constructor(private http: HttpClient,private alertify: AlertifyService, private commonService: CommonService, public env: EnvService) { } 
  
  shift: any = {};
  // shift: ShiftVM;
  getAll(companyCode): Observable<TShiftHeader[]> {
    return this.http.get<TShiftHeader[]>(this.baseUrl + 'shift/GetAll?companyCode='+ companyCode);
  }
  getByStore(companyCode, storeId, top): Observable<TShiftHeader[]> {
    // 
    return this.http.get<TShiftHeader[]>(this.baseUrl + 'shift/getByStore?companyCode='+ companyCode + '&storeId='+ storeId + '&top='+ top);
  }
  GetEndShiftSummary(companyCode, storeId, shiftId): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'shift/GetEndShiftSummary?companyCode='+ companyCode + '&storeId='+ storeId + '&shiftId=' + shiftId);
  }
  ShiftSummaryByDepartment( companyCode,  storeId,  Userlogin,  FDate,  TDate,  dailyId,  shiftId): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'shift/ShiftSummaryByDepartment?companyCode='+ companyCode + '&storeId='+ storeId + '&Userlogin=' + Userlogin
     + '&FDate=' + FDate+ '&TDate=' + TDate
    + '&dailyId=' + dailyId+ '&shiftId=' + shiftId);
  }
  getOpenShiftSummary(companyCode, storeId, date): Observable<any[]> {
    return this.http.get<any>(this.baseUrl + 'shift/GetOpenShiftSummary?companyCode='+ companyCode + '&storeId='+ storeId + '&date=' + date);
  }
   
  loadOpenShift(companyCode, storeId, transdate, userid , CounterId ): Observable<TShiftHeader[]> {
    return this.http.get<TShiftHeader[]>(this.baseUrl + 'shift/LoadOpenShift?CompanyCode='+ companyCode +'&storeId=' + storeId + '&transdate='+ transdate + '&userid='+ userid + '&CounterId='+ CounterId);
  }
  changeShift(shift: TShiftHeader) {
    setTimeout(() => {
      sessionStorage.setItem('fnbItems', null);
      sessionStorage.removeItem("fnbItems");
    });
    setTimeout(() => {
      this.shiftHeader.next(shift); 
    },2);
   
  }
  getCurrentShip()
  {
    let shiftValue = this.commonService.getLocalStorageWithExpiry("shift");
    // JSON.parse(localStorage.getItem("shift"))
    const shift: TShiftHeader = shiftValue as TShiftHeader;
    // console.log(shift);
    // this.changeShift(shift);
    return shift;
  }
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<TShiftHeader[]>> {
    const paginatedResult: PaginatedResult<TShiftHeader[]> = new PaginatedResult<TShiftHeader[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
       
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<TShiftHeader[]>(this.baseUrl + 'shift/GetPagedList', { observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Item[]>(this.baseUrl + 'item/GetAll');
  }
 
  getItem(companyCode, id): Observable<ShiftVM> {
    return this.http.get<ShiftVM>(this.baseUrl + 'shift/GetById?companyCode='+companyCode+'&id=' + id);
  }
  getNewShiftCode(CompanyCode, StoreCode: string, TerminalId) {
    return this.http.get(
      this.baseUrl + 'shift/getNewShiftCode?CompanyCode=' + CompanyCode +  '&StoreCode=' + StoreCode + '&TerminalId=' + TerminalId,
      { responseType: 'text' }
    );
  }
  create(shift: TShiftHeader)
  {
    this.shift = {
      CompanyCode: shift.companyCode,
      StoreId: shift.storeId,
      DailyId: shift.dailyId,
      DeviceId: shift.deviceId,
      OpenAmt: shift.openAmt,
      EndAmt: shift.endAmt,
      ShiftTotal: shift.shiftTotal, 
      CreatedBy: shift.createdBy, 
      Status: 'O',
    };
    // debugger;
    // console.log( this.shift);
    return this.http.post(this.baseUrl + 'shift/CreateShift',  this.shift);
  }
  endShift(shift)
  { 
    if(shift===null || shift === undefined)
    {
      shift = this.getCurrentShip();
    }
    if(shift===null || shift === undefined)
    {
      this.alertify.success("shift don't found!");
    }
   
    return this.http.post(this.baseUrl + 'shift/EndShift',  shift)
    
  }

  EndShiftNew(shift)
  { 
    if(shift===null || shift === undefined)
    {
      shift = this.getCurrentShip();
    }
    if(shift===null || shift === undefined)
    {
      this.alertify.success("shift don't found!");
    }
   
    return this.http.post(this.baseUrl + 'shift/EndShiftNew',  shift)
    
  }
}
