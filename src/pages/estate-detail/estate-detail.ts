import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import moment from 'moment';
import { EliteApiProvider } from '../../providers/elite-api/elite-api';
import { UserSettingsProvider } from '../../providers/user-settings/user-settings';

@IonicPage()
@Component({
  selector: 'page-estate-detail',
  templateUrl: 'estate-detail.html',
})
export class EstateDetailPage {
  estate: any = {};
  estates: any[];
  private locationData: any;
  estateStanding: any = {};
  dateFilter: string;
  allGames: any[];
  useDateFilter = false;
  isSaveing = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public eliteApi: EliteApiProvider,
    public alertController: AlertController,
    public toastController: ToastController,
    public userSettings: UserSettingsProvider) {
    this.estate = this.navParams.get('estate');
  }

  ionViewDidLoad() {
    this.locationData = this.eliteApi.getCurrentLocation();
    //console.log('this.locationData ' + JSON.stringify(this.locationData));
    this.estates = _.chain(this.locationData.estates)
    .filter(g => g.estate1Id === this.estate.id || g.estate2Id === this.estate.id)
    .map(g => {
        return {
          location: g.location,
          locationUrl: g.locationUrl
        };
    })
    .value();
    this.userSettings.isFavoriteEstate(this.estate.id).then(value => this.isSaveing = value);
  }

  toggleSave() {
    if(this.isSaveing) {
      let confirm = this.alertController.create({
        title: "Unsave?",
        message: "Are you sure you want to remove from saved estates?",
        buttons: [
          {
            text: "Yes",
            handler: () => {
              this.isSaveing = false;
              this.userSettings.unfavoriteEstate(this.estate);
              let toast = this.toastController.create({
                message: "You have unsaved this estate!",
                duration: 2000,
                position: "bottom"
              });
              toast.present();
            }
          },
          {
            text: "No"
          }
        ]
      });
      confirm.present();
    } else {
      this.isSaveing = true;
      this.userSettings.favoriteEstate(
        this.estate,
        this.locationData.location.id,
        this.locationData.location.name
      );
    }
  }

  refreshAll(refresher){
    this.eliteApi.refreshCurrentLocation().subscribe(() => {
      refresher.complete();
      this.ionViewDidLoad();
    });
  }
}
