import { TestBed, async } from '@angular/core/testing';
import { BusinessHoursCalculatorComponent } from "./business-hours-calulator.component"
import { BusinessStatus } from "../../enums/business-status";

describe('AppComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
            BusinessHoursCalculatorComponent
        ],
      }).compileComponents();
    }));
  
    it('should create the business hours calculator component', () => {
      const fixture = TestBed.createComponent(BusinessHoursCalculatorComponent);
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('#date should be the current date and time', () => {
        const fixture = TestBed.createComponent(BusinessHoursCalculatorComponent);
        const component = fixture.componentInstance;
        expect(component.date).toBe(new Date(), 'the current datetime');
    });

    it('should be closed on a Sunday', () => {
        const fixture = TestBed.createComponent(BusinessHoursCalculatorComponent);
        const component = fixture.componentInstance;
        const date: Date = new Date ('December 17, 1995 13:24:00')
        component.calculateBusinessHours(date);
        expect(component.isBusinessHours).toBe(BusinessStatus.closed, 'closed on Sunday');
    });
});