import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BusinessHoursCalculatorComponent } from "./components/business-hours-calculator/business-hours-calulator.component"
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BusinessHoursCalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMatDatetimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule 
  ],
  providers: [
    NgxMatDatetimePickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
