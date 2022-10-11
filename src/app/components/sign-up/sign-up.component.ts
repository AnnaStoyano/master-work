import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Auth } from 'firebase/auth';
import { Subscription, take } from 'rxjs';
import { AuthService, SignInfo } from '../../shared/services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../../app.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;

  private _signUp$!: Subscription;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      name: new FormControl('', [Validators.required]),
    });


    this._signUp$ = this._authService.subjectSignUp.asObservable()
    .subscribe((data) => {
      if (!data.isError) {
        this._router.navigate(['/dashboard', { id: data.content.uid }]);
      } else {
        this._dialog.open(ModalComponent, { data });
      }
    });
  }

  ngOnDestroy(): void {
    this._signUp$.unsubscribe();
  }

  get email(): FormControl {
    return this.signUpForm.get('email') as FormControl;
  }

  get name(): FormControl {
    return this.signUpForm.get('name') as FormControl;
  }

  get password(): FormControl {
    return this.signUpForm.get('password') as FormControl;
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

  get getErrorUserNameMessage(): string {
    return this.name.hasError('required') ? 'You must enter a name' : '';
  }

  signUp(): void {
    if (this.signUpForm.status === 'INVALID') {
      this._dialog.open(ModalComponent, { data: { content: 'Fill in the form fields correctly!', isError: true } });

      return;
    }

    this._authService.signUp(this.email.value, this.password.value, this.name.value);
  }
}
