import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'changelogStatusFormat' })

export class ChangelogStatusFormat implements PipeTransform{
    constructor(private sanitized: DomSanitizer) {}
    transform(value){
        // debugger;
    let text1 = "";
    debugger;
    switch(value) { 
        case "I": { 
           //statements; 
           let str = " <span style='color: red; font-weight: 700;'><i class='fas fa-times-circle'></i> Inactive</span>";
           text1 = str;
           break; 
        } 
        case "N": { 
           //statements; 
           let str = "<span style='color: green; font-weight: 700; '> <i class='fas fa-layer-plus'></i> New & Feature</span>";
           text1 = str;
           break; 
        } 
        case "F": { 
            //statements; 
            let str = "<span style='color: #FDA66E; font-weight: 700; '> <i class='fas fa-debug'></i> Fixed</span>";
            text1 = str;
            break; 
         } 
         case "IM": { 
            //statements; 
            let str = "<span style='color: #50A9FF; font-weight: 700; '><i class='fad fa-star'></i> Improved</span>";
            text1 = str;
            break; 
         } 
         case "M": { 
            //statements; 
            let str = "<span style='color: #50A9FF; font-weight: 700; '><i class='fad fa-star'></i> Maintainance</span>";
            text1 = str;
            break; 
         } 
         case "E": { 
            //statements; 
            let str = "<span style='color: #53BB56; font-weight: 700; '><i class='fas fa-engine-warning'></i> Enhance</span>";
            text1 = str;
            break; 
         } 
          
        default: { 
           //statements; 
           let str = "<span style='color: green;font-weight: 700; '><i class='far fa-question-circle'></i>" + value + "</span>";
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