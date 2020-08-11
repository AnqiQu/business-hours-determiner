import { Component } from '@angular/core';
import { BusinessStatus } from "./enums/business-status";
import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'business-hours-determiner';

  changeTheme(status: BusinessStatus) {
    switch (status) {
      case BusinessStatus.open: {
        $("#app-body").removeClass("blue-gradient red-gradient").addClass("green-gradient");
        break;
      }
      case BusinessStatus.closed: {
        $("#app-body").removeClass("blue-gradient green-gradient").addClass("red-gradient");
        break;
      }
      case BusinessStatus.break: {
        $("#app-body").removeClass("green-gradient red-gradient").addClass("blue-gradient");
        break;
      }
      default: {
        $("#app-body").removeClass("green-gradient red-gradient").addClass("blue-gradient");
        break;
      }
    }
  }
}
