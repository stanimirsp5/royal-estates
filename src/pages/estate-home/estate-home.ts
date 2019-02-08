import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EstateDetailPage, MapPage, SimilarPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-estate-home',
  templateUrl: 'estate-home.html',
})
export class EstateHomePage {
  estateDetailTab: any;
  mapTab: any;
  overviewTab: any;
  estate: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.estateDetailTab = EstateDetailPage;
    this.mapTab = MapPage;
    this.overviewTab = SimilarPage;
    this.estate = this.navParams.get('estate');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstateHomePage');
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

}