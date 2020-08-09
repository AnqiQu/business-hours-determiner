import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as data from "../../data/business-hours.json";
import { DayOfWeek } from "../../enums/day-of-week";
import { PublicHoliday } from "../../interfaces/public-holiday.interface";

@Component({
  selector: 'business-day-calculator',
  templateUrl: './business-day-calculator.component.html',
  styleUrls: ['./business-day-calculator.component.scss']
})

export class BusinessDayCalculatorComponent {

  @ViewChild('picker') picker: any;

  dateControl = new FormControl(new Date()); // Sets the default date to now
  disabled = false;
  message: string = "";
  isBusinessHours: boolean;

  constructor() {
  }

  calculateBusinessHours(date: Date) {
    if (!this.isWorkDay(date)) {
      this.message = "We are not open :(";
      this.isBusinessHours = false;
    } else if (this.isPublicHoliday(date)) {
      let holiday: any = this.isPublicHoliday(date);
      this.message = "We are not open. Today is " + holiday.name;
      this.isBusinessHours = false;
    } else if (this.isBreak(date)) {
      this.message = "We are open but just on a break";
      this.isBusinessHours = false;
    } else if (this.isOpen(date)) {
      this.message = "We are open!";
      this.isBusinessHours = true;
    } else {
      throw new Error("Oops, an error occured. Please check your input and try again");
    }
  }

  isWorkDay(date: Date): boolean {
    let workdays: number[] = data.work_week.map(day => {
      return DayOfWeek[day]
    });

    return workdays.includes(date.getDay()) ? true : false;
  }

  isPublicHoliday(date: Date): PublicHoliday | false {
    var Holidays = require('date-holidays')
    let publicHolidays = new Holidays()
    publicHolidays.init('ZA')

    if (!publicHolidays.isHoliday(date)) {
      return false;
    } else {
      let holiday: PublicHoliday;
      return Object.assign(holiday, publicHolidays.isHoliday(date));
    }
  }

  isBreak(date: Date): boolean {
    
  }

  isOpen(date: Date): boolean {

  }

  getNextOpenTime(date: Date): string {

  }

}
