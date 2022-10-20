import { Component, ElementRef, EventEmitter, OnInit, Output, Input, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss', '../../app.component.scss']
})
export class ToDoListItemComponent implements OnInit, OnDestroy {
  @Input('label') label!: string;
  @Input('created') created!: string;
  @Input('id') id!: string;

  textCommand: string = '';

  @ViewChild('removeRef', { read: ElementRef }) removeRef!: ElementRef;

  @Output() deletedItemEvent = new EventEmitter<string>();

  private _textRecognition$!: Subscription;

  constructor(private _voice: VoiceRecognitionService) {

  }

  ngOnInit(): void {
    this._textRecognition$ = this._voice.onTextChange$()
      .subscribe((command: string) => {
        this.textCommand = command.toLowerCase();
        if (this.textCommand.includes('remove') || this.textCommand.includes('delete')) {
          if (this.textCommand.includes(this.label.toLowerCase())) {
            this.removeRef?.nativeElement.click();
          }

        }
      });
  }

  ngOnDestroy(): void {
    this._textRecognition$.unsubscribe();
  }

  onRemove(): void {
    this.deletedItemEvent.emit(this.id);
  }
}