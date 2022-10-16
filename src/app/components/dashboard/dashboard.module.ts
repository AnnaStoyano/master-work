import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import {MatToolbarModule} from '@angular/material/toolbar';
import { ToDoListModule } from "../todo-list/todo-list.module";
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ToDoListModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule
    ],
    declarations: [DashboardComponent],
})
export class DashboardModule { }