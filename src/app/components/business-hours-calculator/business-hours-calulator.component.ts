import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as data from "../../data/business-hours.json";
import { DayOfWeek } from "../../enums/day-of-week";
import { HttpClient } from '@angular/common/http';
import { empty } from 'rxjs';

@Component({
  selector: 'business-hours-calculator',
  templateUrl: './business-hours-calculator.component.html',
  styleUrls: ['./business-hours-calculator.component.scss']
})

export class BusinessHoursCalculatorComponent implements OnInit {

  message: string = "";
  subMessage: string = "";
  isBusinessHours: boolean;
  date: Date = new Date();
  dateControl = new FormControl(new Date()); // Sets the default date to now

  constructor(
    private http: HttpClient, 
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.calculateBusinessHours(this.date);
    this.dateControl.valueChanges.subscribe(value => {
      this.date = value,
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
      this.message = "We are not open because it is " + holiday.name;
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
    let time: number = parseInt(this.doubleDigitFormat(date.getHours().toString()) + this.doubleDigitFormat(date.getMinutes().toString()));
    let workHours: [string, string] = data.work_hours[day];

    return this.isInTimeRange(time, workHours);
  }

  isBreak(date: Date): boolean {
    let day: string = DayOfWeek[date.getDay()];
    let time: number = parseInt(this.doubleDigitFormat(date.getHours().toString()) + this.doubleDigitFormat(date.getMinutes().toString()));
    let workBreaks: [string, string][] = data.work_breaks[day];

    return workBreaks.some(value => {
      return this.isInTimeRange(time, value)
    })
  }

  private getNextOpenTime(date: Date): string {
    let day: string = DayOfWeek[date.getDay()];
    let time: number = parseInt(this.doubleDigitFormat(date.getHours().toString()) + this.doubleDigitFormat(date.getMinutes().toString()));
    let workHours: [string, string] = data.work_hours[day] ? data.work_hours[day] : ["", ""];
    let startTime: number = parseInt(this.getTimeString(workHours[0]));
    let workBreaks: [string, string][] = data.work_breaks[day] ? data.work_breaks[day] : ["", ""];

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
    
    var newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    newDate.setHours(0, 0, 0, 0);
    return this.getNextOpenTime(newDate);

    /**
     * So I couldn't think of a way to fit recursion into finding public holidays,
     * so here is some recursion to make up for that :)
     */
  }

  private getTimeString(time: string): string {
    return time.replace(":", "");
  }

  private isInTimeRange(time: number, timeRange: [string, string]) {
    let startTime = parseInt(this.getTimeString(timeRange[0]));
    let endTime = parseInt(this.getTimeString(timeRange[1]));

    return time > startTime && time < endTime;
  }

  private doubleDigitFormat(n) {
    return n < 10 ? '0' + n : n;
  }

}
