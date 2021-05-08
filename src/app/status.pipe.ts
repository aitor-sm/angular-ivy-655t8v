import { Pipe, PipeTransform } from "@angular/core";
import { basicFlow } from "./flows";

@Pipe({name: 'status'})
export class StatusPipe implements PipeTransform {
  transform(value: number): string {
    return basicFlow[value].name;
  }
}
