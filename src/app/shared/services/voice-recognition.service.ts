import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

//declare var webkitSpeechRecognition: any;

declare var webkitSpeechRecognition: any;
declare var webkitSpeechGrammarList: any;
declare var webkitSpeechRecognitionEvent: any;

@Injectable({
    providedIn: 'root',
})
export class VoiceRecognitionService {
    isStoppedSpeechRecog: boolean = false;
    text: string = 'TEST TEXT';
    tempWords: string = '';

    recognition = new webkitSpeechRecognition();
    speechRecognitionList = new webkitSpeechGrammarList();

    textSubject: Subject<string> = new Subject<string>;


    constructor() {
    }

    init() {
        const colors = ['anna', 'stoyanova', 'new', 'lists', 'gmail', 'sign', 'ua', 'vlad', 'coral', 'list', 'open', 'input', 'add',
            'annastoyanova99@gmail.com'

        ];
        const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(' | ')};`

        this.speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = this.speechRecognitionList;

        this.recognition.continuous = true;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.addEventListener('result', (e: any) => {
            const transcript = Array.from(e.results)
                .map((result: any) => result[0])
                .map((result) => result.transcript)
                .join('');
            this.tempWords = transcript;
        });
    }

    start() {
        this.recognition.start();

        this.recognition.addEventListener('end', (condition: any) => {
            if (this.isStoppedSpeechRecog) {
                this.recognition.stop();
            } else {
                this.recognition.start();
            }
        });
    }

    stop() {
        this.isStoppedSpeechRecog = true;
        this.recognition.stop();
        this.text = this.tempWords;
        this.tempWords = '';

        this.textSubject.next(this.text);
    }

    onTextChange$(): Observable<string> {
        return this.textSubject.asObservable();
    }
}