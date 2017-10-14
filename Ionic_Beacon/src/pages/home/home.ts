import { Component, NgZone } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';

// providers
import { BeaconProvider } from '../../providers/beacon/beacon';

// models
import { BeaconModel } from './beacon-module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beacons: BeaconModel[] = [];
  zone: any;

  constructor(public navCtrl: NavController, public platform: Platform, public events: Events, public beaconProvider: BeaconProvider) {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.beaconProvider.initialise().then((isInitialised) => {
        if (isInitialised) {
          this.listenToBeaconEvents();
        }
      });
    });
  }    

  listenToBeaconEvents() {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => {
      // update the UI with the beacon list
      this.zone.run(() => {
        
        this.beacons = [];
    
        let beaconList = data.beacons;
        beaconList.forEach((beacon) => {
          let beaconObject = new BeaconModel(beacon);
          this.beacons.push(beaconObject);
        });
    
      });
    
    });
  }
}
