import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.css']
})
export class SearchUserComponent implements OnInit {
  @Input() users: User[] = [];
  filteredUsers: User[] = [];

  ngOnInit(): void {
    this.filteredUsers = this.users;
  }

  filterUsers(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(query));
  }
}