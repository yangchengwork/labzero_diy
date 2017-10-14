import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { Platform, Events } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import 'rxjs/add/operator/map';

/*
  Generated class for the BeaconProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;

  constructor(public platform: Platform, public events: Events, public ibeacon: IBeacon) {
    console.log('Hello BeaconProvider Provider');
  }

  initialise(): any {
    let promise = new Promise((resolve, reject) => {
      // we need to be running on a device
      if (this.platform.is('cordova')) {
        // Request permission to use location on iOS
        this.ibeacon.requestAlwaysAuthorization();
      
      // create a new delegate and register it with the native layer
      this.delegate = this.ibeacon.Delegate();
      
      // Subscribe to some of the delegate’s event handlers
      this.delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => {
          this.events.publish('didRangeBeaconsInRegion', data);
        },
        error => console.error()
      );
      
      // setup a beacon region – CHANGE THIS TO YOUR OWN UUID
      this.region = this.ibeacon.BeaconRegion('deskBeacon', '01122334-4556-6778-899a-abbccddeeff0');
      
      // start ranging
      this.ibeacon.startRangingBeaconsInRegion(this.region)
      .then(
        () => {
          resolve(true);
        },
        error => {
          console.error('Failed to begin monitoring: ', error);
          resolve(false);
        });
      } else {
        console.error("This application needs to be running on a device");
        resolve(false);
      }
    });
      
    return promise;
  }
}
