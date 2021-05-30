import { Pipe, PipeTransform } from "@angular/core";
import { MCObject, MCUXObject } from './MC.core'

@Pipe({name: 'DBsort'})
export class DBsortPipe implements PipeTransform {


transform(items:MCUXObject[],ascending:boolean,column:string,type:string){
let sortedItems: MCUXObject[] = [];
sortedItems= ascending ?
this.sortAscending(items,column,type):
this.sortDescending(items,column,type);
return sortedItems;
}

sortAscending(items,column,type){
return [...items.sort(function(a:MCObject,b:MCObject){
if(type==="string"){
if (a.getFieldValue(column).toUpperCase() < b.getFieldValue(column).toUpperCase()) return -1;
}
else{
return a[column]-b[column];
}
})]
}

sortDescending(items,column,type){
return [...items.sort(function(a:MCObject,b:MCObject){
if(type==="string"){
if (a.getFieldValue(column).toUpperCase() > b.getFieldValue(column).toUpperCase()) return -1;
}
else{
return b[column]-a[column];
}
})]
}

}


