import { Pipe, PipeTransform } from "@angular/core";
import { UserList } from "./MC.core";

@Pipe({name: 'user'})
export class UserPipe implements PipeTransform {
  transform(value: number): string {
    return UserList[value];
  }
}
