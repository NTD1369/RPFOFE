import { DatePipe } from "@angular/common";
import { PipeTransform } from "@angular/core";
import { OnInit, Pipe } from "@angular/core";
import { AuthService } from "./_services/auth.service";
import { FormatconfigService } from "./_services/data/formatconfig.service";

@Pipe({
    name: 'dateFormat'
})
export class DateFormat implements PipeTransform{
 
    constructor (private authService: AuthService)
    {
 
    } 
    transform(value: string) {
        let format = this.authService.loadFormat();
        var datePipe = new DatePipe("en-US");
         value = datePipe.transform(value, 'dd/MM/yyyy');
         return value;
     }
     
}