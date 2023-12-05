import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'statusSerialFormat' })

export class StatusSerialFormat implements PipeTransform{
    constructor(private sanitized: DomSanitizer) {}
    transform(value){
        // debugger;
    let text1 = "";
   //  debugger;
    switch(value) { 
        case "I": { 
           //statements; 
           let str = "<span style='color: red; font-weight: 700;'>Inactive</span>";
           text1 = str;
           break; 
        } 
        case "E": { 
           //statements; 
           let str = "<span style='color: red; font-weight: 700;'>Expired</span>";
           text1 = str;
           break; 
        } 
        case "R": { 
            //statements; 
            let str = "<span style='color: red; font-weight: 700;'>Redeemed</span>";
            text1 = str;
            break; 
         } 
          
         case "A": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Active</span>";
            text1 = str;
            break; 
         } 
         
        default: { 
           //statements; 
           let str = "<span style='color: green;font-weight: 700;'>" + value + "</span>";
           text1 = str;
           break; 
        } 
     } 
     
    
    return this.sanitized.bypassSecurityTrustHtml(text1);
 }}

//  @media only screen and (max-width: 480px)
// .right-section .bill-wrapper .table-wrap .bill-table {
//     font-size: 10px;
//     min-width: 600px;
// }