import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DatabaseService } from './database.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subjectSignIn = new Subject<any>();
  subjectSignUp = new Subject<any>();
  subjectSignOut = new Subject<any>();
  subjectSignUserState = new Subject<any>();
  subjectPasswordReset = new Subject<any>();

  // userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private _databaseService: DatabaseService // NgZone service to remove outside scope warning
  ) {
  }

  // Sign in with email/password
  signIn(email: string, password: string): void {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.subjectSignIn.next({ content: { ...userCredential.user }, isError: false });
      })
      .catch((error) => {
        this.subjectSignIn.next({ content: error.message, isError: true });
      });
  }

  signUp(email: string, password: string, name: string): void {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const u = { ...userCredential.user, displayName: name };

        updateProfile(userCredential.user, { displayName: name })
          .then(() => {
            this._databaseService.writeUserData(userCredential.user);

            this.subjectSignUp.next({ content: { ...u }, isError: false });
          });
      })
      .catch((error) => {
        this.subjectSignUp.next({ content: error.message, isError: true });
      });
  }

  signOut(): void {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        this.subjectSignOut.next({ content: 'user sign out', isError: false });
      })
      .catch((error) => {
        this.subjectSignOut.next({ content: error.message, isError: true });
      });
  }

  signedUserState$(): Observable<any> {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.subjectSignUserState.next(user);
      } else {
        // User is signed out
        this.subjectSignUserState.next(null);
      }
    });

    return this.subjectSignUserState.asObservable();
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string): Observable<any> {
    const auth = getAuth();

    sendPasswordResetEmail(auth, passwordResetEmail)
      .then(() => {
        this.subjectPasswordReset.next({ content: 'Password reset email sent, check your inbox.', isError: false })
      })
      .catch((error) => {
        this.subjectPasswordReset.next({ content: error.message, isError: false })
      });

    return this.subjectSignUp.asObservable();
  }
}
