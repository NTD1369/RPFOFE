import { DatePipe } from "@angular/common";
import { PipeTransform } from "@angular/core";
import { OnInit, Pipe } from "@angular/core";
import * as moment from "moment";
import { AuthService } from "./_services/auth.service";
import { FormatconfigService } from "./_services/data/formatconfig.service";

@Pipe({
    name: 'timeSpanFormat'
})
export class TimeSpanFormat implements PipeTransform{
  
    transform(value) {
        // debugger;
        let leng= value.hours.toString().length;
        var hourse = value.hours.toString().length>= 2 ? value.hours  : '0' + value.hours;
        var minute = value.minutes.toString().length >= 2 ? value.minutes  : '0' + value.minutes; 
        var display= hourse + ":" + minute;
        return display;
     }
     
}