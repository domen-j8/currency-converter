import {Component, NgModule, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  amount = 10;

  constructor() {
  }

  ngOnInit(): void {

  }
}
