import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService {

  constructor(
    private http: HttpClient
  ) {
    this.getJSON().subscribe(data => {
      console.log(data)
    });
  }
  public getJSON(): Observable<any> {
    return this.http.get("./assets/data/realse-notes.json")
  }
}
