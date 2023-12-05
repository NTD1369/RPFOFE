
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { PlaceService } from 'src/app/_services/data/place.service';
import { AlertifyService } from 'src/app/_services/system/alertify.service';
@Component({
  selector: 'app-shop-placeInfo',
  templateUrl: './shop-placeInfo.component.html',
  styleUrls: ['./shop-placeInfo.component.css']
})
export class ShopPlaceInfoComponent implements OnInit {
  public placeId;
  public storeId;
  public loginInfo;
  public sourceData;

  constructor(private placeService: PlaceService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertity: AlertifyService) {

    this.route.params.subscribe(data => {
      let placeid = data['placeid'];
      let storeId = data['storeid'];
      this.placeId = placeid;
      this.storeId = storeId;
    })

    this.loginInfo = this.authService.getCurrentInfor();
  }

  ngOnInit() {
    this.loadInfoItem()
  }

  loadInfoItem() {
    this.placeService.getAll(this.loginInfo.companyCode, this.placeId, "").subscribe((res: any) => {
      if (res.success) {
        this.sourceData = res.data
        this.sourceData = this.sourceData.filter(x => x.storeId === this.storeId && x.placeId !== this.placeId);
        let showIsDefault = this.sourceData.find(x => x.isDefault === 'Y')
        if (showIsDefault.placeId !== null && showIsDefault.placeId !== undefined && showIsDefault.placeId !== '' &&
          (this.placeId == null || this.placeId == undefined || this.placeId == '')) {
          this.router.navigate(["admin/table-cashier/", this.storeId, showIsDefault.placeId]);
        }
      }
      else {
        this.alertity.warning(res.message)
      }
    })
  }

  moveTableCashier(newPlace) {
    this.router.navigate(["admin/table-cashier/", newPlace.storeId, newPlace.placeId]);
  }
}
