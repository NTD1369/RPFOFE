import { Component, OnInit } from '@angular/core';  
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-pick-theme',
  templateUrl: './pick-theme.component.html',
  styleUrls: ['./pick-theme.component.scss']
})
export class PickThemeComponent implements OnInit {

  constructor(public themeService: ThemeService) { }

  ngOnInit() {
  }

}
