import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { NotFindComponent } from './components/not-find/not-find.component';
import { SignInModule } from './components/sign-in/sign-in.module';
import { ForgotPasswordModule } from './components/forgot-password/forgot-password.module';
import { SignUpModule } from './components/sign-up/sign-up.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { DashboardInfoModule } from './components/dashboard-info/dashboard-info.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFindComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    SignInModule,
    ForgotPasswordModule,
    SignUpModule,
    DashboardModule,
    DashboardInfoModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
