import { CustomDropdownComponent } from './shared/custom-dropdown/custom-dropdown.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    CustomDropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CustomDropdownComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
