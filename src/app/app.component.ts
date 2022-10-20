import { Component } from '@angular/core';
import { VoiceRecognitionService } from './shared/services/voice-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _isVoiceRecognitionStart: boolean = false;

  constructor(public _voice: VoiceRecognitionService) {
    this._voice.init();
  }

  voiceHandler(): void {
    this._isVoiceRecognitionStart = !this._isVoiceRecognitionStart;

    if (this._isVoiceRecognitionStart) {
      this._voice.stop();
    }

    if (!this._isVoiceRecognitionStart) {
      this._voice.start();
    }
  }
}
