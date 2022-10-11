import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
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

export interface SignUpUser extends User {
  dateCreation: number
}

export interface SignInUser extends User {
  dateEnter: number
}

export interface SignInfo {
  content: string | SignUpUser | SignInUser | null;
  isError: boolean;
}


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
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {}
  // /* Saving user data in localstorage when 
  // logged in and setting up null when logged out */
  // this.afAuth.authState.subscribe((user) => {
  //   if (user) {
  //     this.userData = user;
  //     localStorage.setItem('user', JSON.stringify(this.userData));
  //     JSON.parse(localStorage.getItem('user')!);
  //   } else {
  //     localStorage.setItem('user', 'null');
  //     JSON.parse(localStorage.getItem('user')!);
  //   }
  // });
  //}

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

  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }

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


  // // Returns true when user is looged in and email is verified
  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user')!);
  //   return user !== null && user.emailVerified !== false ? true : false;
  // }
  // // Sign in with Google
  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
  //     this.router.navigate(['dashboard']);
  //   });
  // }
  // // Auth logic to run auth providers
  // AuthLogin(provider: any) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       this.router.navigate(['dashboard']);
  //       this.SetUserData(result.user);
  //     })
  //     .catch((error) => {
  //       window.alert(error);
  //     });
  // }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
//   SetUserData(user: any) {
//     const userRef: AngularFirestoreDocument<any> = this.afs.doc(
//       `users/${user.uid}`
//     );
//     const userData: User = {
//       uid: user.uid,
//       email: user.email,
//       displayName: user.displayName,
//       photoURL: user.photoURL,
//       emailVerified: user.emailVerified,
//     };
//     return userRef.set(userData, {
//       merge: true,
//     });
//   }
//   // Sign out
//   SignOut() {
//     return this.afAuth.signOut().then(() => {
//       localStorage.removeItem('user');
//       this.router.navigate(['sign-in']);
//     });
//   }
// }

// function resolve(user: auth.User) {
//   throw new Error('Function not implemented.');
// }

}