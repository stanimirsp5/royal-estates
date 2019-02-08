import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstateDetailPage } from './estate-detail';

@NgModule({
  declarations: [
    EstateDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EstateDetailPage),
  ],
})
export class EstateDetailPageModule {}
