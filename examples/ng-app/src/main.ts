import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import elpong from 'elpong';

if (environment.production) {
  enableProdMode();
}

elpong.enableAutoload();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
