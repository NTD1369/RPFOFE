import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorList } from 'src/app/_models/inventorycounting';

@Component({
  selector: 'app-Import-errorlist',
  templateUrl: './Import-errorlist.component.html',
  styleUrls: ['./Import-errorlist.component.css']
})
export class ImportErrorlistComponent implements OnInit {
 
  @Input() ErrorRepair:ErrorList[]=[];
   @Input() Erroreexcel:ErrorList[]=[];
   @Input() ListNotExitItem:ErrorList[] =[];
   @Input() ListNullItem =[];
   @Input() ListNullBarcode =[];
   @Input() ListNullUom =[];
   @Input() ListNullSlocid =[];
   @Input() ListNullQuantity =[];
   @Input() ListSerialError =[];
   @Input() ListNullTax :ErrorList[]=[];
   @Input() ListToSlocIdNull:ErrorList[] =[];
   @Input() IsTobincode:boolean = false;
   @Input() ListFrSlocidNull:ErrorList[] =[];
   @Output() outEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
}
