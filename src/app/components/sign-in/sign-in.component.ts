import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';
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
  textCommand: string = '';

  private signIn$!: Subscription;
  private _textRecognition$!: Subscription;

  @ViewChild('emailRef', { static: true }) emailRef!: ElementRef<HTMLElement>;
  @ViewChild('userPassword', { static: true }) passwordRef!: ElementRef<HTMLElement>;
  @ViewChild('loginButton', { read: ElementRef }) loginButtonRef!: ElementRef;
  @ViewChild('signUp', { read: ElementRef }) signUpRef!: ElementRef;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router,
    private _voice: VoiceRecognitionService) {
  }

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

    this._textRecognition$ = this._voice.onTextChange$()
      .subscribe((command: string) => {
        this.textCommand = command.toLowerCase();

        if (this.textCommand === 'focus email' || this.textCommand === 'enter email') {
          this.emailRef.nativeElement.focus();
        }

        if (this.textCommand === 'focus password' || this.textCommand === 'enter password') {
          this.passwordRef.nativeElement.focus();
        }

        if (this.textCommand === 'login' || this.textCommand === 'log in') {
          this.loginButtonRef.nativeElement.click();
        }

        if (this.textCommand === 'sign up' || this.textCommand === 'signup') {
          this.signUpRef.nativeElement.click();
        }
      });
  }

  ngOnDestroy(): void {
    this.signIn$.unsubscribe();
    this._textRecognition$.unsubscribe();
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

  startService() {
    this._voice.start();
  }

  stopService() {
    this._voice.stop();
  }
}
