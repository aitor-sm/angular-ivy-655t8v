import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

//import {MatTableModule} from '@angular/material/table';
import {
  MatButtonModule,
} from '@angular/material/button';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  MatInputModule,
} from '@angular/material/input';
import {
  MatRippleModule
} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TaskList_comp, DialogDeleteTasks} from "./tasklist.comp.component";

import { UserPipe } from './user.pipe';
import { StatusPipe } from './status.pipe';


@NgModule({
  imports: [BrowserModule, FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatTooltipModule, 
    MatCheckboxModule ],
  declarations: [AppComponent, HelloComponent, TaskList_comp, DialogDeleteTasks, UserPipe, StatusPipe],
  entryComponents: [DialogDeleteTasks],
  bootstrap: [AppComponent]
})
export class AppModule {}
