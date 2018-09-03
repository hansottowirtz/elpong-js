import { Component } from '@angular/core';
import elpong from 'elpong';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements NgInit {
  title: string = 'Loading...';

  onNgInit() {
    elpong.enableAutoload();
  }
}
