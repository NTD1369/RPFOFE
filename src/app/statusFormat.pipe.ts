import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'statusFormat' })

export class StatusFormat implements PipeTransform{
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
        case "Inactive": { 
         //statements; 
         let str = "<span style='color: red; font-weight: 700;'>Inactive</span>";
         text1 = str;
         break; 
        } 
        case "E": { 
           //statements; 
           let str = "<span style='color: green; font-weight: 700;'>Event</span>";
           text1 = str;
           break; 
        } 
        case "R": { 
            //statements; 
            let str = "<span style='color: green; font-weight: 700;'>Retail</span>";
            text1 = str;
            break; 
         } 
         case "M": { 
            //statements; 
            let str = "<span style='color: green; font-weight: 700;'>Member</span>";
            text1 = str;
            break; 
         } 
         case "Open": { 
            //statements; 
            let str = "<span style='color: #007bff; font-weight: 700;'>Open</span>";
            text1 = str;
            break; 
         } 

         case "Closed": { 
            //statements; 
            let str = "<span style='color: green; font-weight: 700;'>Closed</span>";
            text1 = str;
            break; 
         } 
         case "Hold": { 
            //statements; 
            let str = "<span style='color: #26c6da; font-weight: 700;'>Hold</span>";
            text1 = str;
            break; 
         } 
         case "Canceled": { 
            //statements; 
            let str = "<span style='color: red; font-weight: 700;'>Canceled</span>";
            text1 = str;
            break; 
         } 
         case "A": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Active</span>";
            text1 = str;
            break; 
         } 
         case "Active": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Active</span>";
            text1 = str;
            break; 
         } 
         case "O": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Open</span>";
            text1 = str;
            break; 
         } 
         case "H": { 
            //statements; 
            let str = "<span style='color: red; font-weight: 700;'>Hold</span>";
            text1 = str;
            break; 
         } 
         case "C": { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Closed</span>";
            text1 = str;
            break; 
         } 
         case "R" : { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Rejected</span>";
            text1 = str;
            break; 
         } 
         case "P": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Partial</span>";
            text1 = str;
            break; 
         } 
         case "Rejected" : { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Rejected</span>";
            text1 = str;
            break; 
         } 
         case "Returned": { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Returned</span>";
            text1 = str;
            break; 
         } 
         case "Partial Return": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Partial Return</span>";
            text1 = str;
            break; 
         } 
         case "Completed": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Completed</span>";
            text1 = str;
            break; 
         } 
         case "Y": { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Yes</span>";
            text1 = str;
            break; 
         } 
         case "N": { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>No</span>";
            text1 = str;
            break; 
         } 
         case "Exchanged": { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Exchanged</span>";
            text1 = str;
            break; 
         } 
         case "Failed"  : { 
            //statements; 
            let str = "<span style='color: red;font-weight: 700;'>Failed</span>";
            text1 = str;
            break; 
         } 
         case "Success" : { 
            //statements; 
            let str = "<span style='color: green;font-weight: 700;'>Success</span>";
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