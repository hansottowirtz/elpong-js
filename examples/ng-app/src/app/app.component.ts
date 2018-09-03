import { Component, OnInit } from '@angular/core';
import elpong from 'elpong';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title: string = 'Loading...';

  ngOnInit() {
    const pig = elpong.get('test-app').select('pigs').find(3);
    document.body.innerHTML = pig.fields.name;
  }
}
