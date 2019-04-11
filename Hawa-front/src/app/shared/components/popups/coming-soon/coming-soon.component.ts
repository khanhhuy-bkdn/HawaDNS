import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor(
    private dialogRef: NbDialogRef<ComingSoonComponent>,
  ) { }

  ngOnInit() {
  }

  closePopup() {
    this.dialogRef.close();
  }

}
