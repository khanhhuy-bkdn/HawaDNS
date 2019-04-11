import { Injectable, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { ApiService } from './api.service';

declare var google: any;

@Injectable()
export class GMapsService {
    /**
     *
     */
    constructor(
        private apiService: ApiService,
    ) {

    }

    getLatLong(address: string) {
        let geocoder = new google.maps.Geocoder();
        return Observable.create(observer => {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    observer.next({});
                    observer.complete();
                }
            });
        })
    }

    // Cập nhật thông tin vị trí của xã
    locationCommuneEdit(id: number, latitude: number, longitude: number,) {
        const url = `commune/location/edit`;
        const requestModel = {
            id: id,
            latitude: latitude,
            longitude: longitude,
        }
        return this.apiService.post(url, requestModel);
    }
}