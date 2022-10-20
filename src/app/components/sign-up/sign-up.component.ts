import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Auth } from 'firebase/auth';
import { Subscription, take } from 'rxjs';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';
import { AuthService} from '../../shared/services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../../app.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  hide: boolean = true;
  textCommand: string = '';

  private _signUp$!: Subscription;
  private _textRecognition$!: Subscription;

  @ViewChild('nameRef', { static: true }) nameRef!: ElementRef<HTMLElement>;
  @ViewChild('emailRef', { static: true }) emailRef!: ElementRef<HTMLElement>;
  @ViewChild('userPassword', { static: true }) passwordRef!: ElementRef<HTMLElement>;
  @ViewChild('signUpRef', { read: ElementRef }) signUpRef!: ElementRef;
  @ViewChild('signInRef', { read: ElementRef }) signInRef!: ElementRef;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router,
    private _voice: VoiceRecognitionService) { }

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

    this._textRecognition$ = this._voice.onTextChange$()
      .subscribe((command: string) => {
        this.textCommand = command.toLowerCase();

        if (this.textCommand === 'focus email' || this.textCommand === 'enter email') {
          this.emailRef.nativeElement.focus();
        }

        if (this.textCommand === 'focus password' || this.textCommand === 'enter password') {
          this.passwordRef.nativeElement.focus();
        }

        if (this.textCommand === 'focus name' || this.textCommand === 'enter name' || this.textCommand === 'enter user name') {
          this.nameRef.nativeElement.focus();
        }

        if (this.textCommand === 'sign in' || this.textCommand === 'sigin' || this.textCommand === 'login') {
          this.signInRef.nativeElement.click();
        }

        if (this.textCommand === 'sign up' || this.textCommand === 'signup') {
          this.signUpRef.nativeElement.click();
        }
      });
  }

  ngOnDestroy(): void {
    this._signUp$.unsubscribe();
    this._textRecognition$.unsubscribe();
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
