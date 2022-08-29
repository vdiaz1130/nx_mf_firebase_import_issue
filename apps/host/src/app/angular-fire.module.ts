import { isDevMode, NgModule } from '@angular/core';

import {
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE as ANALYTICS_DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
  COLLECTION_ENABLED,
} from '@angular/fire/compat/analytics';
import { SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/compat/firestore';
import { USE_DEVICE_LANGUAGE } from '@angular/fire/compat/auth';
import { SERVICE_WORKER, VAPID_KEY } from '@angular/fire/compat/messaging';
import {
  SETTINGS as REMOTE_CONFIG_SETTINGS,
  DEFAULTS as REMOTE_CONFIG_DEFAULTS,
} from '@angular/fire/compat/remote-config';
import { PerformanceMonitoringService } from '@angular/fire/compat/performance';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectFunctionsEmulator, FunctionsModule, getFunctions, provideFunctions } from '@angular/fire/functions';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
  enableMultiTabIndexedDbPersistence,
} from '@angular/fire/firestore';
import { connectDatabaseEmulator, getDatabase, provideDatabase } from '@angular/fire/database';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getApp } from '@angular/fire/app';
import {
  initializeAuth,
  browserPopupRedirectResolver,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  provideAuth,
} from '@angular/fire/auth';
// import { initializeAppCheck, provideAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';

import { BrowserModule } from '@angular/platform-browser';

const environment = {
  useEmulators: true,
  firebase: {
    apiKey: 'OeRPmyK7S_x_5rpQUu1CSNuZMWyAfhokKAIzatE',
    appId: '1:314016560732:web:ff29fa4c16595d51d9d9c5',
    authDomain: 'XXX.firebaseapp.com',
    databaseURL: 'https://XXX.firebaseio.com',
    measurementId: 'G-7GTYSEPWD0',
    messagingSenderId: '357140061632',
    projectId: 'XXX',
    storageBucket: 'XXX.appspot.com',
  }
}

let resolvePersistenceEnabled: (enabled: boolean) => void;

export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
  imports: [
    BrowserModule,
    AngularFireAuthGuardModule,
    FunctionsModule,

    provideRemoteConfig(() => getRemoteConfig()),
    provideAnalytics(() => getAnalytics()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    // provideAppCheck(() =>  {
    //   const provider = new ReCaptchaV3Provider(environment.recaptcha3SiteKey);
    //   return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    // }),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      enableMultiTabIndexedDbPersistence(firestore).then(
        () => resolvePersistenceEnabled(true),
        () => resolvePersistenceEnabled(false),
      );
      return firestore;
    }),
    provideDatabase(() => {
      const database = getDatabase();
      if (environment.useEmulators) {
        connectDatabaseEmulator(database, 'localhost', 9000);
      }
      return database;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
  ],

  providers: [
    UserTrackingService,
    ScreenTrackingService,
    PerformanceMonitoringService,
    { provide: FIRESTORE_SETTINGS, useValue: { ignoreUndefinedProperties: true } },
    { provide: ANALYTICS_DEBUG_MODE, useValue: true },
    { provide: COLLECTION_ENABLED, useValue: true },
    { provide: REMOTE_CONFIG_SETTINGS, useFactory: () => (isDevMode() ? { minimumFetchIntervalMillis: 10_000 } : {}) },
    { provide: REMOTE_CONFIG_DEFAULTS, useValue: { background_color: 'red' } },
    { provide: USE_DEVICE_LANGUAGE, useValue: true },
    // { provide: VAPID_KEY, useValue: environment.vapidKey },
    {
      provide: SERVICE_WORKER,
      useFactory: () =>
        (typeof navigator !== 'undefined' &&
          navigator.serviceWorker?.register('firebase-messaging-sw.js', { scope: '__' })) ||
        undefined,
    },
    { provide: APP_VERSION, useValue: '0.0.0' },
    { provide: APP_NAME, useValue: 'deez.io' },
  ],
})
export class AngularFireModule { }
