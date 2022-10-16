import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../../app.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  hide: boolean = true;

  private signIn$!: Subscription;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required])
    });

    this.signIn$ = this._authService.subjectSignIn.asObservable()
    .subscribe((info) => {
      if (!info.isError) {
        this._router.navigate(['/dashboard/:', { id: info.content.uid }]);
      } else {
        this._dialog.open(ModalComponent, { data: info });
      }
    });
  }

  ngOnDestroy(): void {
    this.signIn$.unsubscribe();
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get getErrorEmailMessage(): string {
    if (this.email.hasError('email')) {
      return 'You must enter a email';
    }

    return this.email.hasError('required') ? 'You must enter a email' : '';
  }

  get getErrorUserPasswordMessage(): string {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }

    if (this.password.hasError('minlength')) {
      return 'You must enter a password of 6 characters or more';
    }

    return '';
  }

  login(): void {
    if (this.loginForm.status === 'INVALID') {
      this._dialog.open(ModalComponent, { data: { content: 'Fill in the form fields correctly!', isError: true } });

      return;
    }

    this._authService.signIn(this.email.value, this.password.value);
  }

  loginWithGoogle(): void {
    // this._authService.GoogleAuth();
  }
}
