import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { EnvService } from 'src/app/env.service';
import { SBarcodeSetup } from 'src/app/_models/barcodesetup';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BarcodesetupService {


  // baseUrl = environment.apiUrl;
  baseUrl = environment.production === true ? this.env.apiUrl : environment.apiUrl;
  constructor( private http: HttpClient, private authService: AuthService , public env: EnvService) { } 
  getAll(companyCode, keyword): Observable<SBarcodeSetup[]> {
    // debugger;
    return this.http.get<SBarcodeSetup[]>(this.baseUrl + 'BarcodeSetup/GetAll?companyCode=' + companyCode + '&keyword=' + keyword);
  } 
  getBarcodeSetup(barCodeStr: string,barcodesetupList: SBarcodeSetup[]): SBarcodeSetup
  { 
    debugger; 
    let result = null;
    for (let index = 0; index < barcodesetupList.length; index++) {
      const setup = barcodesetupList[index];
      let prefixLength = setup?.prefix?.length??0; 
      let barcodePre = barCodeStr.substring(0, prefixLength);
      if(barcodePre === setup.prefix )
      { 
        result = setup;
        break;
      } 
    } 
    return result;
  }
  splitBarcode(barCodeStr: string, barcodesetupList : SBarcodeSetup[]): SBarcodeSetup
  {
   
    let result:SBarcodeSetup = new  SBarcodeSetup();
    let barcodesetup = new  SBarcodeSetup();
    if(barCodeStr!==null && barCodeStr!==undefined && barCodeStr!=='')
    { 
      barcodesetup =  this.getBarcodeSetup(barCodeStr, barcodesetupList);
      debugger;
      if(barcodesetup!==null && barcodesetup!==undefined)
      {
        if(barcodesetup?.charSeparator!==null && barcodesetup?.charSeparator!==undefined && barcodesetup?.charSeparator!=='')
        {
          let splValue = barCodeStr.split(barcodesetup.charSeparator);
          result.prefix = splValue[barcodesetup.prefixPosition - 1];
          result.pluStr = splValue[barcodesetup.pluPosition - 1];
          result.weightStr = splValue[barcodesetup.weightPosition - 1];
          result.barCodeStr = splValue[barcodesetup.barCodePosition - 1];
          result.qtyStr = splValue[barcodesetup.qtyPosition - 1];
          result.checkCode = splValue[barcodesetup.checkPosition - 1];
          result.amountStr = splValue[barcodesetup.amountPosition - 1];   
        }
        else
        { 
          let prefixCheckLength = barcodesetup?.prefix.length;
          if(barcodesetup?.prefixCheckLength!==null && barcodesetup?.prefixCheckLength!==undefined)
          {
            prefixCheckLength = barcodesetup.prefixCheckLength;
          }
          let arr= [
            {"name": "prefix", stt: barcodesetup.prefixPosition, length: prefixCheckLength , str:'' },
            {"name": "pluStr", stt: barcodesetup.pluPosition, length: barcodesetup.pluLength , str:'' },
            {"name": "weightStr", stt: barcodesetup.weightPosition , length: barcodesetup.weightLength, str:'' },
            {"name": "barCodeStr", stt: barcodesetup.barCodePosition , length: barcodesetup.barCodeLength, str:''},
            {"name": "qtyStr", stt: barcodesetup.qtyPosition, length: barcodesetup.qtyLength, str:''  },
            {"name": "checkCode", stt: barcodesetup.checkPosition , length: barcodesetup.checkCodeLength, str:''},
            {"name": "amountStr", stt: barcodesetup.amountPosition , length: barcodesetup.amountLength, str:''}, 
          ];
          arr = arr.sort((a, b) => (a.stt > b.stt) ? 1 : -1);
          let numOfString = 0;
          arr =  arr.filter(x=> x.stt!==undefined && x.stt!== null && x.stt > 0);
          let newStt= 1;
          arr.forEach(element => { 
                element.stt = newStt;
              // if(element.name==='weightStr')
              // {
              //   debugger;
              // }
              element.str = barCodeStr.substr(numOfString, element.length);
              numOfString += element.length ; 
              newStt++
            // element.length
          });
          // debugger;
        
          // barcodesetup.prefixPosition
          
          result.prefix = arr.find(x=>x.name === 'prefix')?.str; 
          result.pluStr = arr.find(x=>x.name === 'pluStr')?.str;
          result.weightStr = arr.find(x=>x.name === 'weightStr')?.str;
          result.barCodeStr = arr.find(x=>x.name === 'barCodeStr')?.str;
          result.qtyStr = arr.find(x=>x.name === 'qtyStr')?.str;
          result.checkCode = arr.find(x=>x.name === 'checkCode')?.str;
          result.amountStr = arr.find(x=>x.name === 'amountStr')?.str;
  
          result.barCodeLength = numOfString;
  
      
        }
        // debugger;
        if(result.amountStr !== null && result.amountStr !== undefined && result.amountStr !== '' )
        {
          if(barcodesetup.amountCalculation!==null && barcodesetup.amountCalculation!==undefined && barcodesetup.amountCalculation!=='' )
          {
            switch(barcodesetup.amountCalculation?.toLowerCase()) { 
              case '*': { 
                //statements; this.authService.roundingAmount(
                result.amountStr = ( parseFloat( result.amountStr) * barcodesetup.amountValue).toString();
                break; 
              } 
              case '/': { 
                //statements; this.authService.roundingAmount(
                result.amountStr = ( parseFloat( result.amountStr) / barcodesetup.amountValue).toString();
                break; 
              } 
              case '+': { 
                //statements; this.authService.roundingAmount(
                result.amountStr = ( parseFloat( result.amountStr) + barcodesetup.amountValue).toString();
                break; 
            } 
            case '-': { 
                //statements; this.authService.roundingAmount(
                result.amountStr = ( parseFloat( result.amountStr) - barcodesetup.amountValue).toString();
                break; 
            } 
              default: { 
                //statements; 
                
                break; 
              } 
          } 
            // if(barcodesetup.amountCalculation?.toLowerCase() === ('*' || '/' || '+' || '-'))
            // {
            //   switch 
            //   result.amountStr = result.amountStr + barcodesetup.amountCalculation?.toLowerCase() + barcodesetup.amountValue;
            // }
          }
        }
        if(result.weightStr !== null && result.weightStr !== undefined && result.weightStr !== '' )
        {
          if(barcodesetup.weightCalculation!==null && barcodesetup.weightCalculation!==undefined && barcodesetup.weightCalculation!=='')
          {
            switch(barcodesetup.weightCalculation?.toLowerCase()) { 
              case '*': { 
                //statements; this.authService.roundingAmount(
                result.weightStr = ( parseFloat( result.weightStr) * barcodesetup.weightValue).toString();
                break; 
              } 
              case '/': { 
                //statements;  this.authService.roundingAmount(
                result.weightStr = (parseFloat( result.weightStr) / barcodesetup.weightValue).toString();
                break; 
              } 
              case '+': { 
                //statements; this.authService.roundingAmount(
                result.weightStr = ( parseFloat( result.weightStr) + barcodesetup.weightValue).toString();
                break; 
            } 
            case '-': { 
                //statements;  this.authService.roundingAmount(
                result.weightStr = (parseFloat( result.weightStr) - barcodesetup.weightValue).toString();
                break; 
            } 
              default: { 
                //statements;  
                break; 
              } 
          } 
          
          }
        }
        result.isOrgPrice = barcodesetup?.isOrgPrice;
        result.customF1 = barcodesetup?.customF1;
        result.customF2 = barcodesetup?.customF2;
        result.customF3 = barcodesetup?.customF3;
        result.customF4 = barcodesetup?.customF4;
        result.customF5 = barcodesetup?.customF5;
      }
      else
      {
         return null;
      }
     
    }
    
    // debugger;
     return result;
  } 
 barcodeCheck(barCodeStr: string)
 {
    let lastCharBarcode = parseInt(barCodeStr.substr(barCodeStr.length - 1)) ;
    let Sumcheck=0;
    let SumcheckStr='';
    // let  XStr='';
    // debugger;
    for (let i = 0; i < barCodeStr.length -1; i++) {
      // debugger;
      let a = 0;
      let vt= 0;
      if(barCodeStr.length % 2 === 0)
      {
        vt= i ;
      }
      else
      {
        vt= i+ 1;
      }
     
      if(vt%2===0)
      {
        a = parseInt( barCodeStr[i]) * 3;
      }
      else
      {
          a = parseInt( barCodeStr[i])  ;
      }
      // XStr += a;
      Sumcheck +=a;
    }
    // debugger;
    SumcheckStr= Sumcheck.toString();
    let lastChar = parseInt(SumcheckStr.substr(SumcheckStr.length - 1)) ;
    let checkCodeSSCC = 10 - lastChar;
    if(checkCodeSSCC===10) {checkCodeSSCC= 0};
    let result =true;
    if(checkCodeSSCC===lastCharBarcode)
    {
      result =true;
    }
    else
    {
      result =false;
    }
    return result;
 }
  getById(companyCode, id): Observable<SBarcodeSetup> {
    return this.http.get<SBarcodeSetup>(this.baseUrl + 'BarcodeSetup/GetById?companyCode=' + companyCode + '&id=' + id);
  }
  
  create(model: SBarcodeSetup) {
     
    return this.http.post(this.baseUrl + 'BarcodeSetup/create', model );
  } 
  update(model: SBarcodeSetup) {
    
    return this.http.put(this.baseUrl + 'BarcodeSetup/update', model);
  }
  delete(model: SBarcodeSetup) {
    
    return this.http.post(this.baseUrl + 'BarcodeSetup/delete', model);
  }

}
