import { Component, OnInit } from '@angular/core';
import { DataReleaseNotes } from './data-release-notes';
import { ReleaseNotesService } from '../../shared/service/release-notes/release-notes.service';
@Component({
  selector: 'release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent implements OnInit {
  listReleaseNotes = [];
  constructor(
    private releaseNotesService: ReleaseNotesService
  ) { }

  ngOnInit() {
    this.releaseNotesService.getJSON().subscribe(data => {
      console.log(data);
      this.listReleaseNotes = data;
    });
  }

}
