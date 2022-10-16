import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import {MatToolbarModule} from '@angular/material/toolbar';
import { ToDoListModule } from "../todo-list/todo-list.module";
import {MatIconModule} from '@angular/material/icon';
import { DashboardInfoComponent } from "./dashboard-info.component";

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
    declarations: [DashboardInfoComponent],
    exports: [DashboardInfoComponent]
})
export class DashboardInfoModule { }