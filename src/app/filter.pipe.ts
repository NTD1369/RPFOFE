import { Component, Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
    name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {  
      debugger;
      if (!items) return [];
      if (!value || value.length == 0) return items;
      return items.filter(it => 
      it[field].toLowerCase().indexOf(value.toLowerCase()) !=-1);
    }
}