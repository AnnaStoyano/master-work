import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { mergeMap, Subscription } from 'rxjs';
import { List, ListTask } from 'src/app/app.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { VoiceRecognitionService } from 'src/app/shared/services/voice-recognition.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss', '../../app.component.scss']
})
export class ToDoListComponent implements OnInit, OnDestroy {
  listData: List = {
    label: '',
    createdData: '',
    taskCount: 0,
    id: ''
  };
  showAddForm: boolean = false;
  currentUser!: User;
  listId!: string;
  newTaskName: FormControl = new FormControl('', [Validators.required]);
  tasksDataJSON: { [key: string]: ListTask } = {};
  tasks: ListTask[] = [];
  textCommand: string = '';

  private _signedUserState$!: Subscription;
  private _textRecognition$!: Subscription;

  @ViewChild('taskName', { static: false }) taskNameRef?: ElementRef<HTMLElement>;
  @ViewChild('newTaskRef', { read: ElementRef }) addTaskRef!: ElementRef;
  @ViewChild('cancelRef', { read: ElementRef }) cancelRef!: ElementRef;
  @ViewChild('addRef', { read: ElementRef }) addRef!: ElementRef;
  @ViewChildren('taskRef', { read: ElementRef }) tasksRef!: QueryList<ElementRef>;

  @Output() taskAddEvent = new EventEmitter<string>();

  constructor(private _database: DatabaseService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _voice: VoiceRecognitionService) { }

  ngOnInit(): void {
    this.listId = this.route.snapshot.paramMap.get('id') as string;

    this._signedUserState$ = this._authService.signedUserState$()
      .pipe(
        mergeMap((user) => {
          this.currentUser = user;
          return this._database.getUserList(user, this.listId);
        })
      )
      .pipe(
        mergeMap((listData) => {
          this.listData = listData;

          return this._database.getAllUserTasks(this.currentUser);
        })
      )
      .subscribe((tasksData) => {
        this.tasksDataJSON = tasksData || {};

        const allTasks: ListTask[] = tasksData ? Object.values(tasksData) : [];

        this.tasks = allTasks.filter(task => this.listData.id === task.listId);
      });

    this._textRecognition$ = this._voice.onTextChange$()
      .subscribe((command: string) => {
        this.textCommand = command.toLowerCase();

        if (this.textCommand === 'new task' || this.textCommand === 'new' || this.textCommand === 'add new task' || this.textCommand === 'ed new task' || this.textCommand === 'task' || this.textCommand.includes('create')) {
          this.addTaskRef.nativeElement.click();
        }

        if (this.textCommand === 'add' || this.textCommand === 'ed') {
          this.addRef.nativeElement.click();
        }

        if (this.textCommand === 'cancel' || this.textCommand === 'clear' || this.textCommand === 'remove') {
          this.cancelRef.nativeElement.click();
        }
      })
  }

  ngOnDestroy(): void {
    this._signedUserState$.unsubscribe();
  }

  addTask(): void {
    this.showAddForm = true;

    setTimeout(() => {
      this.taskNameRef?.nativeElement.focus();
    }, 0);
  }

  getErrorMessage(): string {
    if (this.newTaskName.hasError('required')) {
      return 'You must enter a task name';
    }

    return '';
  }

  onCancel(): void {
    this.showAddForm = false;
    this.newTaskName.setValue('');
    this.newTaskName.markAsUntouched();
  }

  onAdd(): void {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    if (!this.newTaskName.value) {
      return;
    }

    const newTask: ListTask = {
      id: uuid(),
      listId: this.listData.id,
      label: this.newTaskName.value,
      createdData: dd + '.' + mm + '.' + yyyy
    };

    this.tasks.push(newTask);

    this.showAddForm = false;
    this.newTaskName.setValue('');
    this.newTaskName.markAsUntouched();

    this.listData = { ...this.listData, taskCount: this.listData.taskCount + 1 }

    Object.defineProperty(this.tasksDataJSON, newTask.id, { value: newTask });

    this._database.writeUserTaskData(this.currentUser as User, newTask);
    this._database.updateListData(this.currentUser, this.listData);
  }

  onDeleteItem(taskId: string): void {
    const task = this.tasks.find(task => task.id === taskId);
    const index = task ? this.tasks.indexOf(task) : null;

    let taskCount = this.listData.taskCount;

    if (index) {
      this.tasks.splice(index, 1);
      this._delete(this.tasksDataJSON, taskId);
      taskCount -= 1;
    }

    if (index === 0 && !this.tasksDataJSON) {
      this.tasks.splice(index, 1);
      this.tasksDataJSON = {};
      taskCount = 0;
    }

    if (index === 0 && this.tasksDataJSON) {
      this.tasks.splice(index, 1);
      this._delete(this.tasksDataJSON, taskId);
      taskCount = 0;
    }

    this.listData = { ...this.listData, taskCount: taskCount < 0 ? 0 : taskCount };
    this._database.updateListData(this.currentUser, this.listData);
    this._database.updateTasksData(this.currentUser, this.tasksDataJSON);
  }

  private _delete(obj: { [key: string]: any }, prop: string): void {
    if (obj[prop] && !obj[prop].length) {
      delete obj[prop];
    }
  }
}