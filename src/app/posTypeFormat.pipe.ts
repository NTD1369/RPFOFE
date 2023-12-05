import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'posTypeFormat' })

export class PosTypeFormat implements PipeTransform{
    constructor(private sanitized: DomSanitizer) {}
    transform(value){
        // debugger;
    let text1 = "";
    // debugger;
     
    if(value==="E")
    {
        let str = "<span style='color: green; font-weight: 700;'>Event</span>";
        text1 = str;
    }
    if(value==="R")
    {
        let str = "<span style='color: green; font-weight: 700;'>Retail</span>";
        text1 = str;
    }
    if(value==="M")
    {
        let str = "<span style='color: green; font-weight: 700;'>Member</span>";
        text1 = str;
    }
     
    if(value==="C" )
    {
        let str = "<span style='color: green;font-weight: 700;'>Class</span>";
        text1 = str;
    } 
     
    return this.sanitized.bypassSecurityTrustHtml(text1);
 }}

//  @media only screen and (max-width: 480px)
// .right-section .bill-wrapper .table-wrap .bill-table {
//     font-size: 10px;
//     min-width: 600px;
// }