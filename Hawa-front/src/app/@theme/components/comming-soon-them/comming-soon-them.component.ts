import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'comming-soon-them',
  templateUrl: './comming-soon-them.component.html',
  styleUrls: ['./comming-soon-them.component.scss']
})
export class CommingSoonThemComponent implements OnInit {

  constructor(
    private dialogRef: NbDialogRef<CommingSoonThemComponent>,
  ) { }

  ngOnInit() {
  }

  closePopup() {
    this.dialogRef.close();
  }
}
