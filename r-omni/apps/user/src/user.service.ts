import { Injectable } from '@nestjs/common';
import {UserCreate} from "./dto/user.create";
import {UserUpdate} from "./dto/user.update";

@Injectable()
export class UserService {
  private users: UserCreate[] = [
    { id: 1, name: 'vladimir', email: 'vladimir@example.com' },
    { id: 2, name: 'nikita', email: 'nikita@example.com' },
  ];

  findAll() {
    console.log('UserService findAll method called');
    return this.users;
  }

  findOne(id: number) {
    console.log('UserService findOne method called');
    return this.users.find(user => user.id === id);
  }

  create(user: any) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, userData: UserUpdate) {
    console.log('UserService update method called');
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      return this.users[userIndex];
    }
    return null;
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      const deletedUser = this.users[userIndex];
      this.users.splice(userIndex, 1);
      return deletedUser;
    }
    return null;
  }
}