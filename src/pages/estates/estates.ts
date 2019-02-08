import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { EstateHomePage } from '../pages';
import { EliteApiProvider } from '../../providers/elite-api/elite-api';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-estates',
  templateUrl: 'estates.html',
})
export class EstatesPage {
  estates = [];
  private allEstates: any;
  private allEstateRegions: any;
  public queryText: string;
  public publicSelectedLocation: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public eliteApi: EliteApiProvider,
    public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    let selectedLocation = this.navParams.data;
    this.publicSelectedLocation = this.navParams.data;
 
    let loader = this.loadingController.create({
      content: 'Getting data...'
    });

    loader.present().then(() => {
      this.eliteApi.getLocationData(selectedLocation.id).subscribe(data => {
        console.log('---From estates.ts---- data.estates is: ' + data.estates);
        this.allEstates = data.estates;
        // subdivide the estates into regions
        this.allEstateRegions =
          _.chain(data.estates)
          .groupBy('region')
          .toPairs()
          .map(item => _.zipObject(['regionName', 'regionEstates'], item))
          .value();
          this.estates = this.allEstateRegions;    
          loader.dismiss();  
      });
    });
  }

  itemTapped($event, estate) {
    this.navCtrl.push(EstateHomePage, {estate: estate});
  }

  updateEstates(){
    let queryTextLower = this.queryText.toLowerCase();
    let filteredEstates = [];
    _.forEach(this.allEstateRegions, td => {
      let estates = _.filter(td.regionEstates, t => (<any>t).name.toLowerCase().includes(queryTextLower));
      if (estates.length) {
        filteredEstates.push({ regionName: td.regionName, regionEstates: estates });
      }
    });

    this.estates = filteredEstates;
  }
}