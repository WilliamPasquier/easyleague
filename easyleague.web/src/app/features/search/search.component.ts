import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '@shared/models/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output() search = new EventEmitter<Event>();
  users: User[] = [
    { username: 'User1', number: 1, region: 'Region1', rank: 'Rank1' },
    { username: 'User2', number: 2, region: 'Region2', rank: 'Rank2' },
    { username: 'User3', number: 3, region: 'Region3', rank: 'Rank3' },
  ];
  filteredUsers: User[] = [];

  ngOnInit(): void {
    this.filteredUsers = this.users;
  }

  filterUsers(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(query));
  }
}