import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private _router: Router) {}

  redirectToSimplexDefault(): void {
    this._router.navigate(['/main/simplex-default']);
  }
}
