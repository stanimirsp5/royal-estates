import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyEstatesPage, LocationsPage, EstateHomePage } from '../pages/pages';
import { UserSettingsProvider } from '../providers/user-settings/user-settings';
import { EliteApiProvider } from '../providers/elite-api/elite-api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyEstatesPage;
  favoriteEstates: any[];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userSettings: UserSettingsProvider,
    public loadingController: LoadingController,
    public eliteApi: EliteApiProvider,
    public events: Events) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.events.subscribe('favorites:changed', () => this.refreshFavorites());
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  goHome() {
    this.nav.push(MyEstatesPage);
  }

  goToLocations() {
    this.nav.push(LocationsPage);
  }

  refreshFavorites() {
    this.userSettings.getAllFavorites().then(favs => this.favoriteEstates = favs);
    window.location.reload()
  }

  goToEstate(favorite) {
    let loader = this.loadingController.create({
      content: 'Getting data...',
      dismissOnPageChange: true
    });
    loader.present();
    this.eliteApi.getLocationData(favorite.tournamentId).subscribe(l => this.nav.push(EstateHomePage, favorite.estate));
  }
}
