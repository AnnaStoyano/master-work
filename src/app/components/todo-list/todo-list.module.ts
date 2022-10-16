import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ToDoListItemModule } from "../todo-list-item/todo-list.module";
import { ToDoListComponent } from "./todo-list.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ToDoListItemModule
    ],
    declarations: [ToDoListComponent],
    exports: [ToDoListComponent]
})
export class ToDoListModule { }