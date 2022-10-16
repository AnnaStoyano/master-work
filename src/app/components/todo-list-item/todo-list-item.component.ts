import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss', '../../app.component.scss']
})
export class ToDoListItemComponent implements OnInit {
  @Input('label') label: any;
  @Input('created') created: any;
  @Input('id') id: any;

  @Output() deletedItemEvent = new EventEmitter<string>();
  constructor(){}

  ngOnInit(): void {
      
  }

  onRemove(): void {
    this.deletedItemEvent.emit(this.id);
  }
}