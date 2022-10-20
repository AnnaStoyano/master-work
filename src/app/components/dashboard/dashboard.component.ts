import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../app.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userUid: string = ':id';
  textCommand: string = '';

  private _signOut$!: Subscription;
  private _signedUserState$!: Subscription;
  private _textRecognition$!: Subscription;

  @ViewChild('signOutRef', { read: ElementRef }) signOutRef!: ElementRef;
  @ViewChild('dashboardRef', { read: ElementRef }) dashboardRef!: ElementRef;

  constructor(private _authService: AuthService,
    private _dialog: MatDialog,
    private _router: Router,
    private _voice: VoiceRecognitionService) {
  }

  ngOnInit(): void {
    this._signOut$ = this._authService.subjectSignOut.asObservable()
      .subscribe((data) => {
        if (!data.isError) {
          this._router.navigate(['/sign-in']);
        } else {
          this._dialog.open(ModalComponent, { data });
        }
      });

    this._signedUserState$ = this._authService.signedUserState$()
      .subscribe((data) => {
        this.userUid = data?.uid || '';
      });

    this._textRecognition$ = this._voice.onTextChange$()
      .subscribe((command: string) => {
        this.textCommand = command.toLowerCase();

        if (this.textCommand === 'dashboard' || this.textCommand === 'go dashboard' || this.textCommand === 'main page' || this.textCommand === 'all lists' || this.textCommand === 'lists') {
          this.dashboardRef.nativeElement.click();
        }

        if (this.textCommand === 'sign out' || this.textCommand === 'sign out') {
          this.signOutRef.nativeElement.click();
        }
      });
  }

  ngOnDestroy(): void {
    this._signOut$.unsubscribe();
    this._signedUserState$.unsubscribe();
    this._textRecognition$.unsubscribe();
  }

  signOut(): void {
    this._authService.signOut();
  }
}
