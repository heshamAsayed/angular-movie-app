import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })


/**
 * FirebaseModule centralizes Firebase initialization for the Angular app.
 * It uses the modular Firebase SDK via @angular/fire providers and reads
 * configuration from `src/environments/environment.ts` so secrets are not
 * hardcoded in code.
 */
@NgModule({
  // For the modern `provide*` functions we register them as providers.
  // Putting them into `imports` breaks the static analysis used by the
  // Angular compiler. Providers accept the EnvironmentProviders returned
  // by the `provide*` helpers.
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
})
export class FirebaseModule {}
