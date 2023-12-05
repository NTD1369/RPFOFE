import { PipeTransform } from "@angular/core";
import { OnInit, Pipe } from "@angular/core";
import { AuthService } from "./_services/auth.service";
import { FormatconfigService } from "./_services/data/formatconfig.service";

@Pipe({
    name: 'currencyFormat'
})
export class CurrencyFormat implements PipeTransform{
    ThousandFormat=",";
    DecimalFormat=".";
    DecimalPlacesFormat=2;
    constructor (private authService: AuthService)
    {

        // console.log("constructor currency Format");
    }
    // ngOnInit(){
    //     console.log("ngOnInit currency Format");
    //     debugger;
    //     this.formatStore.getByStore("ST0001").subscribe((data)=>{
    //         debugger;
    //         this.ThousandFormat = data.thousandFormat;
    //         this.DecimalFormat = data.decimalFormat;
    //         this.DecimalPlacesFormat = parseInt(data.decimalPlacesFormat) ;
    //     });    
    // }

    transform(value: number ): string {
        if(value!==null && value!==undefined)
        {
            // debugger;
            // value /= 100;
            value= parseFloat(value.toString());
            let format = this.authService.loadFormat();
            let decimalLength;
            let chunkDelimiter;
            let decimalDelimiter;
            if(format===null || format===undefined)
            {
                decimalLength = parseInt(this.DecimalPlacesFormat.toString()) ;// ;
                chunkDelimiter =  this.ThousandFormat;
                decimalDelimiter =  this.DecimalFormat;
            }
            else
            {
                decimalLength = parseInt(format.decimalPlacesFormat) ;// this.DecimalPlacesFormat;
                chunkDelimiter = format.thousandFormat;// this.ThousandFormat;
                decimalDelimiter = format.decimalFormat;// this.DecimalFormat;
            }
            let currencySign = 'đ ';

            let chunkLength = 3;
            let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
            let num = value.toFixed(Math.max(0, ~~decimalLength));
            //+ currencySign
            return (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter) ;

        }
       
    }
}