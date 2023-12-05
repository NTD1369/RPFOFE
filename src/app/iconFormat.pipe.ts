import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'iconFormat' })

export class IconFormat implements PipeTransform{
    constructor(private sanitized: DomSanitizer) {}
    transform(value){
        // debugger;
    let text1 = "";
    if(value===true)
    {
        let str = '<i style="color: green; font-weight: 700;" class="fas fa-check-circle"></i>';// <span style='color: green; font-weight: 700;'>True</span>";
        text1 = str;
    }
    else
    {
       
        let str = '<i style="color: red; font-weight: 700;" class="fas fa-times-circle"></i>';
        text1 = str;
    }
    return this.sanitized.bypassSecurityTrustHtml(text1);
 }}

//  @media only screen and (max-width: 480px)
// .right-section .bill-wrapper .table-wrap .bill-table {
//     font-size: 10px;
//     min-width: 600px;
// }