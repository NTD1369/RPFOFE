import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management-print-design',
  templateUrl: './management-print-design.component.html',
  styleUrls: ['./management-print-design.component.scss']
})
export class ManagementPrintDesignComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
export class Table{
  id: string="";
  rows: TableRow[] = [];
  columns: TableColumn[] = []; 
}
export class TableColumn{
  id: string="";
  index: number | null;
  title: string=""; 
  colSpan: number | null;
  visible: number | null;
  marginTop: number | null;
  marginBot: number | null;
  marginLeft: number | null; 
  marginRight: number | null;
  paddingTop: number | null;
  paddingBot: number | null;
  paddingLeft: number | null; 
  paddingRight: number | null; 
  condition: string=""; 
}

export class TableRow{
  id: string="";
  index: number | null;
  title: string=""; 
  colSpan: number | null;
  visible: number | null;
  marginTop: number | null;
  marginBot: number | null;
  marginLeft: number | null; 
  marginRight: number | null;
  paddingTop: number | null;
  paddingBot: number | null;
  paddingLeft: number | null; 
  paddingRight: number | null; 
  condition: string=""; 
}