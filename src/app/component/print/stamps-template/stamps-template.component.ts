import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxPrinterService } from 'ngx-printer';
import { AuthService } from 'src/app/_services/auth.service';
import { PrintwaiverService } from 'src/app/_services/data/printwaiver.service';
import { MwiService } from 'src/app/_services/mwi/mwi.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
import { ItemList, UserWaiver } from '../waiver-form/waiver-form.component';

@Component({
  selector: 'app-stamps-template',
  templateUrl: './stamps-template.component.html',
  styleUrls: ['./stamps-template.component.scss']
})
export class StampsTemplateComponent implements OnInit {

  @Input() model: MItemStamps;


  constructor(private authService: AuthService, private mwiService: MwiService, private printerService: NgxPrinterService, private alertifyService: AlertifyService,
    private printService: PrintwaiverService) {
  }

  dateFormat = "";
  ngOnInit() {
    console.log('model', this.model);
  }
}

export class MItemStamps {
  barCode: string = "";
  itemCode: string = "";
  itemName: string = "";
  uomName: string = "";
  priceAfterTax: number = 0;
}