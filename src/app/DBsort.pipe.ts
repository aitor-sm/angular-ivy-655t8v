import { Pipe, PipeTransform } from "@angular/core";
import { MCFieldType, MCObject, MCUXObject } from './MC.core'

@Pipe({name: 'DBsort'})
export class DBsortPipe implements PipeTransform {


transform(items:MCUXObject[],ascending:boolean,column:string,type:MCFieldType){
let sortedItems: MCUXObject[] = [];
sortedItems= ascending ?
this.sortAscending(items,column,type):
this.sortDescending(items,column,type);
return sortedItems;
}

sortAscending(items,column,type){
return [...items.sort(function(a:MCObject,b:MCObject){
if(type===MCFieldType.MCFTstring){
if (a.getFieldValue(column).toUpperCase() < b.getFieldValue(column).toUpperCase()) return -1;
}
else{
return a[column]-b[column];
}
})]
}

sortDescending(items,column,type){
return [...items.sort(function(a:MCObject,b:MCObject){
if(type===MCFieldType.MCFTstring){
if (a.getFieldValue(column).toUpperCase() > b.getFieldValue(column).toUpperCase()) return -1;
}
else{
return b[column]-a[column];
}
})]
}

}


