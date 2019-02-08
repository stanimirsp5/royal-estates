import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { EstateHomePage } from '../pages';
import { EliteApiProvider } from '../../providers/elite-api/elite-api';
import * as _ from 'lodash';
import { l } from '@angular/core/src/render3';

@IonicPage()
@Component({
  selector: 'page-similar',
  templateUrl: 'similar.html',
})
export class SimilarPage {

  public estates = [];
  public toggled : any;
  private allEstates: any;
  private allEstateRegions: any;
  public queryText: string;
  public publicSelectedLocation: any;
  estate: any = {};
  _location: any = {};
  public selectedPublicLocation: any;
  public selectedPublicRegion: any;
  locationFilter = 'all';
  public toggleFlag: boolean;
  public currentEstates = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public eliteApi: EliteApiProvider,
    public loadingController: LoadingController,
  ){}

  ionViewDidLoad() {
    
    this.declareEstates();

  }

  declareEstates(): void {
    
    let selectedLocation = this.eliteApi.getCurrentLocation();//this.navParams.data;
    this.selectedPublicLocation = this.eliteApi.getCurrentLocation();
    this.publicSelectedLocation = this.navParams.data;
    this.estate = this.navParams.get('estate');
    this.selectedPublicRegion = this.estate.region;
    this._location = this.navParams.get('locations-data');
    let _getCur = this.eliteApi.getCurrentLocation();

    // console.log('this.estate------>> ' + JSON.stringify(this.estate));
    // console.log('this._location------>> ' + JSON.stringify(this._location));
    // console.log('selectedLocation------>> ' + JSON.stringify(selectedLocation));
    // console.log('publicSelectedLocation------>> ' + JSON.stringify(this.publicSelectedLocation));
    // console.log('_getCur------>> ' + JSON.stringify(_getCur));
    // console.log('selectedPublicRegion---------->' + this.selectedPublicRegion);
    
    let loader = this.loadingController.create({
      content: 'Getting data...'
    });
    this.eliteApi.getLocationData(selectedLocation.location.id).subscribe(data => {
      this.allEstates = data.estates;
      // subdivide the estates into regions
      this.allEstateRegions =
        _.chain(data.estates)
        .groupBy('region')
        .toPairs()
        .map(item => _.zipObject(['regionName', 'regionEstates'], item))
        .value();
        this.estates = this.allEstateRegions;
        console.log('this.estates------>> ' + JSON.stringify(this.estates));
        loader.dismiss();  
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

  public trasFilter(category : any, tog : any) : void {

    this.declareEstates();

    let togg : boolean = tog;
    console.log('Toggled? ' + togg);

    let val : string = category;
    console.log('Value: ' + val);

    if (!togg) {
      return;
    } else {
      if (val !== ''){
        this.estates.forEach((region, i) => {
          region.regionEstates = region.regionEstates.filter((imot) => {
            return imot.type == val;
          })
        })
        this.estates = this.estates.filter((reg) => {
          return reg.regionEstates.length > 0;
        })
  
      }
      console.log('filtered estates: ' + JSON.stringify(this.estates));
    }

  }
  
}