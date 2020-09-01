import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigate',
  template: ''
})
export class NavigationComponent {

  constructor() {
    document.location.href = 'https://www.google.com/';
  }

}
