import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgchartComponentComponent } from './orgchart-component.component';

describe('OrgchartComponentComponent', () => {
  let component: OrgchartComponentComponent;
  let fixture: ComponentFixture<OrgchartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgchartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgchartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
