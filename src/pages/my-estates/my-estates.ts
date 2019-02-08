import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocationsPage, EstateHomePage } from '../pages';
import { EliteApiProvider } from '../../providers/elite-api/elite-api';
import { UserSettingsProvider } from '../../providers/user-settings/user-settings';

@IonicPage()
@Component({
  selector: 'page-my-estates',
  templateUrl: 'my-estates.html',
})
export class MyEstatesPage {
  favorites = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingController: LoadingController, 
    public eliteApi: EliteApiProvider,
    public userSettings: UserSettingsProvider
    ) {
  }

  ionViewDidLoad() {
    this.userSettings.getAllFavorites().then(favs => this.favorites = favs);
  }

  goToLocations(){
    this.navCtrl.push(LocationsPage);
  }

  favoriteTapped($event, favorite){
    let loader = this.loadingController.create({
        content: 'Getting data...'
    });
    loader.present();
    this.eliteApi.getLocationData(favorite.locationId)
        .subscribe(t => {
            loader.dismiss();
            this.navCtrl.push(EstateHomePage, {estate: favorite.estate});
        });
  }

}
