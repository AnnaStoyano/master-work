import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss', '../../app.component.scss']
})
export class ToDoListComponent implements OnInit {
    constructor(){}

    ngOnInit(): void {
        
    }
}