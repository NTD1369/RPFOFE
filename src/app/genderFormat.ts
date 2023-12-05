import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'genderFormat' })

export class GenderFormat implements PipeTransform{
    constructor(private sanitized: DomSanitizer) {}
    transform(value, version){
        debugger;
    let text1 = "";
    // debugger;
    if(version === 'vi')
    {
        if(value==="male")
        {
            let str = "<span >Nam</span>";
            text1 = str;
        }
        if(value==="female")
        {
            let str = "<span >Nữ</span>";
            text1 = str;
        }
    }
    else
    {
        if(value==="male")
        {
            let str = "<span >Male</span>";
            text1 = str;
        }
        else
        {
            if(value==="female")
            {
                let str = "<span >Female</span>";
                text1 = str;
            }
            else
            {
                let str = "<span >Female</span>";
                text1 = str;
            }
        }
        
    }
     
    return this.sanitized.bypassSecurityTrustHtml(text1);
 }}

//  @media only screen and (max-width: 480px)
// .right-section .bill-wrapper .table-wrap .bill-table {
//     font-size: 10px;
//     min-width: 600px;
// }