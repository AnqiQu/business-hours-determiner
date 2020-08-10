import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as data from "../../data/business-hours.json";
import { DayOfWeek } from "../../enums/day-of-week";
import { PublicHoliday } from "../../interfaces/public-holiday.interface";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'business-day-calculator',
  templateUrl: './business-day-calculator.component.html',
  styleUrls: ['./business-day-calculator.component.scss']
})

export class BusinessDayCalculatorComponent implements OnInit {

  @Output() status = new EventEmitter<boolean>();

  message: string = "";
  subMessage: string = "";
  isBusinessHours: boolean;
  date: Date;
  time: number;
  dateControl = new FormControl(new Date()); // Sets the default date to now

  constructor(
    private http: HttpClient, 
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.dateControl.valueChanges.subscribe(value => {
      this.date = value,
      this.time = parseInt(this.doubleDigitFormat(this.date.getHours().toString()) + this.doubleDigitFormat(this.date.getMinutes().toString()));
      this.calculateBusinessHours(this.date)
    })
  }

  calculateBusinessHours(date: Date) {
    let holiday: any = this.isPublicHoliday(date);

    if (!this.isWorkDay(date)) {
      this.message = "We are not open on this day :(";
      this.subMessage = "We will be open next at " + this.getNextOpenTime(date);
      this.isBusinessHours = false;
    } else if (holiday) {
      this.message = "We are not open. Today is " + holiday.name;
      this.subMessage = "We will be open next at " + this.getNextOpenTime(date);
      this.isBusinessHours = false;
    } else if (this.isWorkHours(date)) {
      if (this.isBreak(date)) {
        this.message = "We are open but currently on a short break";
        this.subMessage = "We will be open next at " + this.getNextOpenTime(date);
        this.isBusinessHours = false;
      } else {
        this.message = "We are open!";
        this.subMessage = "We will be open until " + this.getNextOpenTime(date);
        this.isBusinessHours = true;
      }
    } else {
      this.message = "We are not open during these hours :(";
      this.subMessage = "We will be open next at " + this.getNextOpenTime(date);
      this.isBusinessHours = false;
    }

    this.status.emit(this.isBusinessHours);
  }

  isWorkDay(date: Date): boolean {
    let workdays: number[] = data.work_week.map(day => {
      return DayOfWeek[day]
    });

    return workdays.includes(date.getDay()) ? true : false;
  }

  isPublicHoliday(date: Date): any {
    var Holidays = require('date-holidays')
    let publicHolidays = new Holidays()
    publicHolidays.init('ZA')

    return publicHolidays.isHoliday(date);
  }

  isWorkHours(date: Date): boolean {
    let day: string = DayOfWeek[date.getDay()];
    let workHours: [string, string] = data.work_hours[day];

    return this.isInTimeRange(this.time, workHours);
  }

  isBreak(date: Date): boolean {
    let day: string = DayOfWeek[date.getDay()];
    let workBreaks: [string, string][] = data.work_breaks[day];

    return workBreaks.some(value => {
      return this.isInTimeRange(this.time, value)
    })
  }

  private getNextOpenTime(date: Date): string {
    let day: string = DayOfWeek[date.getDay()];
    let time: number = parseInt(this.doubleDigitFormat(date.getHours().toString()) + this.doubleDigitFormat(date.getMinutes().toString()));
    let workHours: [string, string] = data.work_hours[day];
    let startTime: number = parseInt(this.getTimeString(workHours[0]));
    let workBreaks: [string, string][] = data.work_breaks[day];

    if (this.isWorkDay(date) && !this.isPublicHoliday(date)) {
      if (this.isWorkHours(date)) {
        if (this.isBreak(date)) {
          for (let i = 0; i < workBreaks.length; i++) {
            if (this.isInTimeRange(time, workBreaks[i])) {
              return workBreaks[i][1] + " on " + date.toDateString();
            }
          }
          throw new Error("Oops an error occured. Please check your input and try again")
        } else {
          return workHours[1] + " on " + date.toDateString();
        }
      } else if (time < startTime){
        return workHours[0] + " on " + date.toDateString();
      }
    } 
    
    var newDate = new Date();
    newDate.setDate(date.getDate() + 1);
    newDate.setHours(0, 0, 0, 0);
    return this.getNextOpenTime(newDate);
  }

  private getTimeString(time: string): string {
    return time.replace(":", "");
  }

  private isInTimeRange(time: number, timeRange: [string, string]) {
    let startTime = parseInt(this.getTimeString(timeRange[0]));
    let endTime = parseInt(this.getTimeString(timeRange[1]));

    return this.time > startTime && this.time < endTime;
  }

  private doubleDigitFormat(n) {
    return n < 10 ? '0' + n : n;
  }

}
