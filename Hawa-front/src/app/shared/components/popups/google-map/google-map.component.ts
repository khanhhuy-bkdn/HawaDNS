import { Component, OnInit, Input, ChangeDetectorRef, NgZone, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MapService } from '../../../service/map.service';
import { GMapsService } from '../../../service/google-map.service';
import { LocationMap } from '../../../model/gg-map/location-map.model';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  @Input() id: number;
  @Input() address: string
  @Input() locationLatitude: number;
  @Input() locationLongitude: number;
  @Input() markerAddress: string;
  @Input() markerLabel: string;

  @ViewChild('infoWindow') infoWindow: ElementRef;
  // location = {
  //   lat: 9.17682,
  //   lng: 105.15242
  // };
  loading: boolean;
  updateLocation = false;

  constructor(
    private dialogRef: NbDialogRef<GoogleMapComponent>,
    private ref: ChangeDetectorRef,
    private map: MapService,
    private gMapsService: GMapsService,
    private __zone: NgZone
  ) { }

  ngOnInit() {
    if (!(this.locationLatitude && this.locationLongitude)) {
      this.getAddress();
    }
  }

  closePopup() {
    if (this.updateLocation) {
      const locationMap = new LocationMap();
      locationMap.id = +this.id;
      locationMap.locationLatitude = this.locationLatitude;
      locationMap.locationLongitude = this.locationLongitude;
      this.dialogRef.close(locationMap);
    } else {
      this.dialogRef.close();
    }

  }

  getAddress() {
    this.gMapsService.getLatLong(this.address)
      .subscribe(
        result => {
          this.__zone.run(() => {
            this.locationLatitude = result.lat();
            this.locationLongitude = result.lng();
            if (this.id) {
              this.gMapsService.locationCommuneEdit(this.id, this.locationLatitude, this.locationLongitude).subscribe(respone => {
                this.updateLocation = true;
              });
            }
          })
        },
        error => console.log(error),
        () => console.log('Geocoding completed!')
      );
  }

}

