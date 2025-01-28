import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrgchartComponentComponent } from './orgchart-component/orgchart-component.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OrgchartComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'org-chat';

  ngOnInit() {

  }
}
