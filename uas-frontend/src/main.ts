import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

import 'zone.js';
import LogRocket from 'logrocket';

LogRocket.init('arfj91/project-web');

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
