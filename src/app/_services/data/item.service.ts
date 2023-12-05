import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debug } from 'console';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { Item } from 'src/app/_models/item';
import { ItemScanBarcodeViewModel } from 'src/app/_models/itemScanBarcodeViewModel';
import { MItemSerial } from 'src/app/_models/mitemserial';
import { PaginatedResult } from 'src/app/_models/pagination';
import { MStore } from 'src/app/_models/store';
import { DataImport } from 'src/app/_models/viewmodel/dataimport';
import { ItemCheckModel, ItemViewModel } from 'src/app/_models/viewmodel/itemViewModel';
import { UploadImageModel } from 'src/app/_models/viewmodel/uploadImage';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, public env: EnvService) { }

  item: any = {};
  getItems(companyCode, StoreId, ItemCode, Keyword,  uomcode?, barcode?, merchandise?, Group?, ItemCate1?, ItemCate2?, ItemCate3?, CustomF1?, CustomF2?, CustomF3?, CustomF4?, CustomF5?
    , CustomF6?, CustomF7?, CustomF8?, CustomF9?, CustomF10?, ValidFrom?, ValidTo?, IsSerial?, IsBOM?, IsVoucher?, IsCapacity?, CustomerGroupId?, PriceListId? , PLU? , PriceFrom? , PriceTo?,display?): Observable<any> {
   
      if(uomcode===null || uomcode===undefined ) {  uomcode =""; }
      if(barcode===null || barcode===undefined )  { barcode =""; }
      if(merchandise===null || merchandise===undefined ) { merchandise =""; }
      if(Group===null || Group===undefined ) { Group =""; }
      if(ItemCate1===null || ItemCate1===undefined ) { ItemCate1 ="";  }
      if(ItemCate2===null || ItemCate2===undefined ) { ItemCate2 =""; }
      if(ItemCate3===null || ItemCate3===undefined ) { ItemCate3 =""; }

      if(CustomF1===null || CustomF1===undefined ) { CustomF1 =""; }
      if(CustomF2===null || CustomF2===undefined ) { CustomF2 =""; }
      if(CustomF3===null || CustomF3===undefined ) { CustomF3 =""; }
      if(CustomF4===null || CustomF4===undefined ) { CustomF4 =""; }
      if(CustomF5===null || CustomF5===undefined ) { CustomF5 =""; }
      if(CustomF6===null || CustomF6===undefined ) { CustomF6 =""; }
      if(CustomF7===null || CustomF7===undefined ) { CustomF7 =""; }
      if(CustomF8===null || CustomF8===undefined ) { CustomF8 =""; }
      if(CustomF9===null || CustomF9===undefined ) { CustomF9 =""; }
      if(CustomF10===null || CustomF10===undefined ) { CustomF10 =""; }
      if(ValidFrom===null || ValidFrom===undefined ) { ValidFrom =null; }
      if(ValidTo===null || ValidTo===undefined ) { ValidTo =null; }
      if(IsSerial===null || IsSerial===undefined ) { IsSerial =null; }
        if(IsBOM===null || IsBOM===undefined ) { IsBOM = null; }
        if(IsVoucher===null || IsVoucher===undefined ) { IsVoucher = null; }
        if(IsCapacity===null || IsCapacity===undefined ) { IsCapacity = null; }
        if(CustomerGroupId===null || CustomerGroupId===undefined ) { CustomerGroupId =""; }
        if(PriceListId===null || PriceListId===undefined ) { PriceListId =""; }
        if(PLU===null || PLU===undefined ) { PLU =""; } 
      if(PriceFrom===null || PriceFrom===undefined ) { PriceFrom =""; }
      if(PriceTo===null || PriceTo===undefined )  { PriceTo =""; }
      if(display===null || display===undefined )  { display = "";  }
      // debugger;
      return this.http.get<any>(this.baseUrl + 'item/GetAll?companyCode=' + companyCode + '&storeId=' + StoreId + '&itemcode=' + ItemCode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + Keyword + '&merchandise=' + merchandise + '&Group=' + Group
        + '&ItemCate1=' + ItemCate1 + '&ItemCate2=' + ItemCate2 + '&ItemCate3=' + ItemCate3 + '&CustomF1=' + CustomF1 + '&CustomF2=' + CustomF2 + '&CustomF3=' + CustomF3 + '&CustomF4=' + CustomF4
        + '&CustomF5=' + CustomF5 + '&CustomF6=' + CustomF6 + '&CustomF7=' + CustomF7 + '&CustomF8=' + CustomF8 + '&CustomF9=' + CustomF9 + '&CustomF10=' + CustomF10 + '&ValidFrom=' + ValidFrom
        + '&ValidTo=' + ValidTo + '&IsSerial=' + IsSerial + '&IsBOM=' + IsBOM + '&IsVoucher=' + IsVoucher + '&IsCapacity=' + IsCapacity + '&CustomerGroupId=' + CustomerGroupId + '&PriceListId=' + PriceListId + '&PLU=' + PLU  + '&PriceFrom=' + PriceFrom  + '&PriceTo=' + PriceTo +'&Display=' + display );
   
   
   
      // return this.http.get<any>(this.baseUrl + 'item/GetAll?companyCode=' + companyCode + '&StoreId=' + StoreId + '&ItemCode=' + ItemCode + '&Keyword=' + Keyword);
  
  
  
  }
  getItemsByList(companyCode, ViewBy,  itemList)  {
      let model: any = {};
      model.companyCode = companyCode;  
      model.itemList = itemList;
      model.viewBy = ViewBy;
      // return this.http.post(this.baseUrl + 'item/GetAllByList', model );
   
      return this.http.post(this.baseUrl + 'item/GetAllByList', model );
  
  }
  getImage(url) {
    let httpHeaders = new HttpHeaders().set('Accept', "image/webp,*/*");

    return this.http.get<Blob>(url, { headers: httpHeaders, responseType: 'blob' as 'json' });
  }
  public avartaUpdate(companyCode, itemCode, image): Observable<any> {
    // debugger;
    var formData: any = new FormData();
    let model = new UploadImageModel();
    model.param = companyCode;
    // model.param2 = itemCode;
    model.image = image;
    // formData.append('uploadModel', model); 
    // formData.append('itemCode', itemCode); 
    formData.append('image', image);
    // formData.append("param", "abc"); 
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    // return this.http.post(this.baseUrl + 'item/Create', item);
    // return this.http.put(this.baseUrl + 'item/update', item);
    let headers = new HttpHeaders();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.baseUrl + 'item/avartaupdate?companyCode=' + companyCode + '&itemCode=' + itemCode, formData);
  }
  getItemFilter(company, store, itemcode, uomcode, barcode, keyword, merchandise, Group, ItemCate1, ItemCate2, ItemCate3, CustomF1, CustomF2, CustomF3, CustomF4, CustomF5
    , CustomF6, CustomF7, CustomF8, CustomF9, CustomF10, ValidFrom, ValidTo, IsSerial, IsBOM, IsVoucher, IsCapacity, CustomerGroupId, PriceListId , PLU , PriceFrom , PriceTo, isScanner? ): Observable<ItemViewModel[]> {
    if(PriceFrom===null || PriceFrom===undefined )
    {
      PriceFrom ="";
    }
    if(PriceTo===null || PriceTo===undefined )
    {
      PriceTo ="";
    }
    if(isScanner===null || isScanner===undefined )
    {
      isScanner = false;
    }
    // debugger;
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/getItemFilter?companyCode=' + company + '&storeId=' + store + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + keyword + '&merchandise=' + merchandise + '&Group=' + Group
      + '&ItemCate1=' + ItemCate1 + '&ItemCate2=' + ItemCate2 + '&ItemCate3=' + ItemCate3 + '&CustomF1=' + CustomF1 + '&CustomF2=' + CustomF2 + '&CustomF3=' + CustomF3 + '&CustomF4=' + CustomF4
      + '&CustomF5=' + CustomF5 + '&CustomF6=' + CustomF6 + '&CustomF7=' + CustomF7 + '&CustomF8=' + CustomF8 + '&CustomF9=' + CustomF9 + '&CustomF10=' + CustomF10 + '&ValidFrom=' + ValidFrom
      + '&ValidTo=' + ValidTo + '&IsSerial=' + IsSerial + '&IsBOM=' + IsBOM + '&IsVoucher=' + IsVoucher + '&IsCapacity=' + IsCapacity + '&CustomerGroupId=' + CustomerGroupId + '&PriceListId=' + PriceListId + '&PLU=' + PLU  + '&PriceFrom=' + PriceFrom  + '&PriceTo=' + PriceTo + '&isScanner=' + isScanner );
  }
  GetItemFilterByList(company, store,  CustomerGroupId, PriceListId , itemList: ItemCheckModel[] ){
     
    // debugger;
    return this.http.post(this.baseUrl + 'item/getItemFilter?companyCode=' + company + '&storeId=' + store + '&CustomerGroupId=' + CustomerGroupId + '&PriceListId=' + PriceListId, itemList );
  }
  applyStoreListing( model ){
   
    // debugger;
    return this.http.post(this.baseUrl + 'item/ApplyStoreListing', model );
  }
  getItemViewList(company, store, itemcode, uomcode, barcode, keyword, merchandise, CustomerGroupId, type?, PriceListId?,licensePlate?): Observable<ItemViewModel[]> {
    // let storeSelected= this.authService.storeSelected();
    debugger
    // if(company== '' || company== null || company == undefined)
    // {
    //   company= storeSelected.companyCode;
    // }
    // if(store== '' || store== null || store == undefined)
    // {
    //   store= storeSelected.storeId;
    // }
    if (licensePlate === null || licensePlate === undefined || licensePlate === 'undefined') {
      licensePlate = '';
    }
    if (type === null || type === undefined || type === 'undefined') {
      type = '';
    }
    if (PriceListId === null || PriceListId === undefined || PriceListId === 'undefined') {
      PriceListId = '';
    }
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/getItemViewList?company=' + company + '&store=' + store + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + keyword + '&merchandise=' + merchandise + '&type=' + type + '&CustomerGroupId=' + CustomerGroupId + '&PriceListId=' + PriceListId+ '&licensePlate=' + licensePlate);
  }
  GetItemOtherViewList(company, store, itemcode, uomcode, barcode, keyword, merchandise, CustomerGroupId, type?): Observable<ItemViewModel[]> {

    if (type === null || type === undefined || type === 'undefined') {
      type = '';
    }

    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemOtherViewList?company=' + company + '&store=' + store + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + keyword + '&merchandise=' + merchandise + '&type=' + type + '&CustomerGroupId=' + CustomerGroupId);
  }
  GetItemWithoutPriceList(company, store, itemcode, uomcode, barcode, keyword, merchandise, type?,isCounted?): Observable<ItemViewModel[]> {
    if (type === null || type === undefined || type === 'undefined') {
      type = '';
    }
    debugger;
    if (isCounted === null || isCounted === undefined || isCounted === 'undefined') {
      isCounted = false;
    }
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemWithoutPriceList?company=' + company + '&store=' + store + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + keyword + '&merchandise=' + merchandise + '&type=' + type + '&isCount=' +isCounted);
  }
  GetItemPrice(company, store, itemcode, uomcode, barcode): Observable<ItemViewModel[]> {

    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemPrice?company=' + company + '&store=' + store + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode);
  }
  CheckMasterData(companyCode, storeId, keyword, CustomerGroupId): Observable<ItemViewModel[]> {

    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/CheckMasterData?companyCode=' + companyCode + '&storeId=' + storeId + '&keyword=' + keyword + '&CustomerGroupId=' + CustomerGroupId);
  }
  GetItemInforList(company, store, itemcode, uomcode, barcode, keyword, merchandise, type?, PriceListId?): Observable<ItemViewModel[]> {
    if (type === null || type === undefined || type === 'undefined') {
      type = '';
    }
    if (PriceListId === null || PriceListId === undefined || PriceListId === 'undefined') {
      PriceListId = '';
    }

    // debugger;
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemInfor?company=' + company + '&itemcode=' + itemcode + '&uomcode=' + uomcode + '&barcode=' + barcode + '&keyword=' + keyword + '&merchandise=' + merchandise + '&type=' + type + '&PriceListId=' + PriceListId);
  }
  GetItemWPriceList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<ItemViewModel[]>> {
    const paginatedResult: PaginatedResult<ItemViewModel[]> = new PaginatedResult<ItemViewModel[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
      if (userParams.merchandise !== null && userParams.merchandise !== undefined) {
        params = params.append('merchandise', userParams.merchandise);

      }
      if (userParams.company !== null && userParams.company !== undefined) {
        params = params.append('company', userParams.company);

      }
      if (userParams.itemCode !== null && userParams.itemCode !== undefined) {
        params = params.append('itemCode', userParams.itemCode);

      }
      if (userParams.barCode !== null && userParams.barCode !== undefined) {
        params = params.append('barCode', userParams.barCode);

      }
      params = params.append('orderBy', userParams.orderBy);
    }
    // debugger;
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemWPriceList', { observe: 'response', params })
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
  getItemPagedList(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<Item[]>> {
    const paginatedResult: PaginatedResult<Item[]> = new PaginatedResult<Item[]>();
    debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
      params = params.append('PageSize', itemsPerPage);
    }

    if (userParams != null) {
      if(userParams.keyword !== null && userParams.keyword !== undefined){
        params = params.append('keyword', userParams.keyword);
      }

      if (userParams.merchandise !== null && userParams.merchandise !== undefined) {
        params = params.append('merchandise', userParams.merchandise);

      }
      if(userParams.company !== null && userParams.company !== undefined  && userParams.company !== ''){
        params = params.append('company', userParams.company);
      }
      if(userParams.orderBy !== null && userParams.orderBy !== undefined){
        params = params.append('orderBy', userParams.orderBy);
      }
    }

    return this.http.get<Item[]>(this.baseUrl + 'item/GetPagedList', { observe: 'response', params })
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
  getItemPagedListByMer(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<Item[]>> {
    const paginatedResult: PaginatedResult<Item[]> = new PaginatedResult<Item[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    // debugger;
    if (userParams != null) {
      params = params.append('keyword', userParams.keyword);
      if (userParams.merchandise !== null && userParams.merchandise !== undefined) {
        params = params.append('merchandise', userParams.merchandise);

      }

      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<Item[]>(this.baseUrl + 'item/getBymer', { observe: 'response', params })
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
  getItem(id): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'item/GetById?id=' + id);
  }
  getItemStock(company, store, sloc, itemcode, uomcode, barcode, serialNum): Observable<ItemViewModel> {
    return this.http.get<ItemViewModel>(this.baseUrl + 'item/ItemStock?companyCode=' + company + '&storeId=' + store + '&slocId=' + sloc + '&itemCode=' + itemcode
      + '&uomcode=' + uomcode + '&barCode=' + barcode + '&serialNum=' + serialNum);
  }
  getItemByCode(companyCode, itemCode): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl + 'item/GetItemByCode?companyCode=' + companyCode + '&itemCode=' + itemCode);
  }
 
  getScanBarcode(company, userId, storeId, keyword, customerGroupId): Observable<ItemScanBarcodeViewModel[]> {
    return this.http.get<ItemScanBarcodeViewModel[]>(this.baseUrl + 'item/GetScanBarcode?companyCode=' + company + '&userId=' + userId + '&storeId=' + storeId +'&keyword=' + keyword + '&customerGroupId=' + customerGroupId);
  }

  create(item: Item) {
    // this.item = {
    //   ItemCode: item.itemCode,
    //   CompanyCode: item.itemCode,
    //   CreateBy: item.itemCode,
    //   CreatedOn: item.itemCode,
    //   ModifiedBy: item.itemCode,
    //   ModifiedOn: item.itemCode,
    //   ItemGroupId: item.itemCode,
    //   TaxCode: item.itemCode,
    //   ItemName: item.itemCode,
    //   ItemDescription: item.itemCode,
    //   ItemCategory_1: item.itemCode,
    //   ItemCategory_2: item.itemCode,
    //   ItemCategory_3: item.itemCode,
    //   ForeignName: item.itemCode,
    //   MainUOM: item.itemCode,
    //   ImageURL: item.itemCode,
    //   ImageLink: item.itemCode,
    //   MCId: item.itemCode,
    //   Weight: item.Weight,
    //   Height: item.Height,
    //   Width: item.Width,
    //   Length: item.Length,
    //   Volume: item.Volume,
    //   CustomField1: item.customeField1,
    //   CustomField2: item.customeField2,
    //   CustomField3: item.customeField3,
    //   CustomField4: item.customeField4,
    //   CustomField5: item.customeField5,
    //   CustomField6: item.customeField6,
    //   CustomField7: item.customeField7,
    //   CustomField8: item.customeField8,
    //   CustomField9: item.customeField9,
    //   CustomField10: item.customeField10,
    //   DefaultPrice: item.defaultPrice,
    //   Status: 'A',
    // };

    return this.http.post(this.baseUrl + 'item/Create', item);
  }

  update(item: Item) {
    // debugger;
    // this.item = {
    //   ItemCode: item.itemCode,
    //   CompanyCode: item.itemCode,
    //   CreateBy: item.itemCode,
    //   CreatedOn: item.itemCode,
    //   ModifiedBy: item.itemCode,
    //   ModifiedOn: item.itemCode,
    //   ItemGroupId: item.itemCode,
    //   TaxCode: item.itemCode,
    //   ItemName: item.itemCode,
    //   ItemDescription: item.itemCode,
    //   ItemCategory_1: item.itemCode,
    //   ItemCategory_2: item.itemCode,
    //   ItemCategory_3: item.itemCode,
    //   ForeignName: item.itemCode,
    //   MainUOM: item.itemCode,
    //   ImageURL: item.itemCode,
    //   ImageLink: item.itemCode,
    //   MCId: item.itemCode,
    //   Weight: item.Weight,
    //   Height: item.Height,
    //   Width: item.Width,
    //   Length: item.Length,
    //   Volume: item.Volume,
    //   CustomField1: item.customeField1,
    //   CustomField2: item.customeField2,
    //   CustomField3: item.customeField3,
    //   CustomField4: item.customeField4,
    //   CustomField5: item.customeField5,
    //   CustomField6: item.customeField6,
    //   CustomField7: item.customeField7,
    //   CustomField8: item.customeField8,
    //   CustomField9: item.customeField9,
    //   CustomField10: item.customeField10,
    //   DefaultPrice: item.defaultPrice,
    //   Status: 'A',
    // };

    return this.http.put(this.baseUrl + 'item/update', item);
  }

  delete(Id: string) {
    return this.http.delete(this.baseUrl + 'item/delete' + Id);
  }

  import(data: DataImport) {
    let store = this.authService.storeSelected();
    data.createdBy = this.authService.decodeToken?.unique_name;
    data.companyCode = store.companyCode;
    return this.http.post(this.baseUrl + 'item/import', data);
  }
  getItemSerialByItem(page?, itemsPerPage?, userParams?): Observable<any> {
    const paginatedResult: PaginatedResult<MItemSerial[]> = new PaginatedResult<MItemSerial[]>();
    // debugger;
    let params = new HttpParams();


    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (page == null || page == undefined) {
      page = 1;
    }
    if (itemsPerPage == null || itemsPerPage == undefined) {
      itemsPerPage = 50;
    }
    // debugger;
    if (userParams != null) {
      if (userParams?.keyword !== null && userParams?.keyword !== undefined) {
        params = params.append('keyword', userParams.keyword);
      }
      if (userParams?.company !== null && userParams?.company !== undefined) {
        params = params.append('company', userParams.company);
      }
      if (userParams?.itemCode !== null && userParams?.itemCode !== undefined) {
        params = params.append('item', userParams.itemCode);

      }
      if (userParams?.slocId !== null && userParams?.slocId !== undefined) {
        params = params.append('slocId', userParams.slocId);

      }
      if (userParams?.customer !== null && userParams?.customer !== undefined) {
        params = params.append('customer', userParams.customer); 
      }
      params = params.append('orderBy', userParams.orderBy);
    }

    return this.http.get<any>(this.baseUrl + 'item/GetPagedListSerialByItem', { observe: 'response', params })
      .pipe(
        map((response: any) => {
          if (response.body.success === false) {
            paginatedResult.result = null;

            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
            }
            return paginatedResult;
          }
          else {
            paginatedResult.result = response.body;

            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
            }
            return paginatedResult;
          }

        }))
  }


  getSerialByItem(companyCode, itemCode, Keyword, SlocId): Observable<MItemSerial[]> {
    return this.http.get<MItemSerial[]>(this.baseUrl + 'item/GetSerialByItem?CompanyCode=' + companyCode + '&ItemCode=' + itemCode  + '&Keyword=' + Keyword  + '&SlocId=' + SlocId);
  }

  GetItemByVoucherCollection(companyCode, StoreId,  itemCode): Observable<ItemViewModel[]> {
    return this.http.get<ItemViewModel[]>(this.baseUrl + 'item/GetItemByVoucherCollection?CompanyCode=' + companyCode + '&StoreId=' + StoreId + '&ItemCode=' + itemCode);
  }
}
