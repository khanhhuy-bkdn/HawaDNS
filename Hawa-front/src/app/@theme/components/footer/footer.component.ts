import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <footer class="text-muted">Copyright &copy; {{currentYear}}. All rights reserved.</footer>
  `,
  // Powered by BYS
})
export class FooterComponent implements OnInit {
  currentYear = (new Date()).getFullYear();
  ngOnInit() {
  }
}
