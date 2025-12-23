import 'zone.js';
import { App } from './app/app';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';

import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  
    provideClientHydration(),                             
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(MatSnackBarModule),
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }
  ]
});
