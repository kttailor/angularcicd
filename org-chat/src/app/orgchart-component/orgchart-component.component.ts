import {
  OnChanges,
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-orgchart-component',
  imports: [],
  templateUrl: './orgchart-component.component.html',
  styleUrl: './orgchart-component.component.scss'
})

// https://github.com/bumbeishvili/org-chart?tab=readme-ov-file

export class OrgchartComponentComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chartContainer')
  chartContainer!: ElementRef;
  @Input()
  data!: any[];
  chart: any;


  ngOnInit() { }


  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewInit(): void {
    // Check if we are in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.createOrgChart();
    } else {
      console.warn('Not in a browser environment. OrgChart cannot be rendered.');
    }
  }

  expandAll() {
    if (this.chart) {
      this.chart.expandAll().fit();
    }
  }

  collapseAll() {
    if (this.chart) {
      this.chart.collapseAll().fit();
    }
  }

  // Export Image functionality
  exportImg() {
    if (this.chart) {
      this.chart.exportImg({
        save: false,
        full: true,
        onLoad: (base64: string) => {
          const img = new Image();
          img.src = base64;
          img.onload = () => {
            const pdf = new jsPDF();
            pdf.addImage(img, 'JPEG', 5, 5, 595 / 3, (img.height / img.width) * 595 / 3);
            pdf.save('chart.pdf');
          };
        },
      });
    }
  }

  // Export SVG functionality
  exportSvg() {
    if (this.chart) {
      this.chart.exportSvg();
    }
  }

  exportPDF() {
    console.log('exportPDF call');
    if (this.chart) {
      this.chart.exportImg({
        save: false,
        full: true,
        onLoad: (base64: string) => {
          const pdf = new jsPDF();
          const img = new Image();
          img.src = base64;
          img.onload = () => {
            pdf.addImage(img, 'JPEG', 5, 5, 595 / 3, (img.height / img.width) * 595 / 3);
            pdf.save('chart.pdf');
          };
        },
      });
    }
  }

  zoomIn() {
    if (this.chart) {
      this.chart.zoomIn();
    }
  }

  zoomOut() {
    if (this.chart) {
      this.chart.zoomOut();
    }
  }

  fit() {
    if (this.chart) {
      this.chart.fit();
    }
  }

  // Method to set layout to 'right'
  setLayoutRight() {
    if (this.chart) {
      this.chart.layout('right').render().fit();
    }
  }

  // Method to set layout to 'top'
  setLayoutTop() {
    if (this.chart) {
      this.chart.layout('top').render().fit();
    }
  }

  // Method to set layout to 'left'
  setLayoutLeft() {
    if (this.chart) {
      this.chart.layout('left').render().fit();
    }
  }

  // Method to set layout to 'bottom'
  setLayoutBottom() {
    if (this.chart) {
      this.chart.layout('bottom').render().fit();
    }
  }

  // Method to filter the chart based on the search input
  filterChart(event: any) {
    // Get input value
    const value = event.target.value;

    // Clear previous highlighting
    this.chart.clearHighlighting();

    // Get chart nodes
    const data = this.chart.data();

    // Mark all previously expanded nodes for collapse
    data.forEach((d: any) => (d._expanded = false));

    // Loop over data and check if input value matches any name
    data.forEach((d: any) => {
      if (value != '' && d.name.toLowerCase().includes(value.toLowerCase())) {
        // If matches, mark node as highlighted
        d._highlighted = true;
        d._expanded = true;
      }
    });

    // Update data and rerender graph
    this.chart.data(data).render().fit();

    console.log('filtering chart', event.target.value);
  }

  horizontal() {
    if (this.chart) {
      this.chart.compact(false).render().fit();
    }
  }

  compact() {
    if (this.chart) {
      this.chart.compact(true).render().fit()
    }
  }


  createOrgChart() {
    // Fetch data from the CSV URL - https://raw.githubusercontent.com/bumbeishvili/sample-data/main/data-oracle.csv
    d3.csv('https://raw.githubusercontent.com/bumbeishvili/sample-data/main/data-oracle.csv').then((data) => {

      // Check if the chartContainer is available before proceeding
      if (this.chartContainer && this.chartContainer.nativeElement) {
        this.chart = new OrgChart()
          .rootMargin(100)
          .nodeWidth((d) => 210)
          .nodeHeight((d) => 140)
          .childrenMargin((d) => 130)
          .compactMarginBetween((d) => 75)
          .compactMarginPair((d) => 80)
          .nodeContent((d: any, i, arr, state) => {
            const colors = [
              '#6E6B6F',
              '#18A8B6',
              '#F45754',
              '#96C62C',
              '#BD7E16',
              '#802F74',
            ];
            const color = colors[d.depth % colors.length];
            const imageDim = 80;
            const lightCircleDim = 95;
            const outsideCircleDim = 110;

            return `
                <div style="background-color:white; position:absolute;width:${d.width
              }px;height:${d.height}px;">
                   <div style="background-color:${color};position:absolute;margin-top:-${outsideCircleDim / 2}px;margin-left:${d.width / 2 - outsideCircleDim / 2}px;border-radius:100px;width:${outsideCircleDim}px;height:${outsideCircleDim}px;"></div>
                   <div style="background-color:#ffffff;position:absolute;margin-top:-${lightCircleDim / 2
              }px;margin-left:${d.width / 2 - lightCircleDim / 2}px;border-radius:100px;width:${lightCircleDim}px;height:${lightCircleDim}px;"></div>
                   <img src=" ${d.data.image
              }" style="position:absolute;margin-top:-${imageDim / 2}px;margin-left:${d.width / 2 - imageDim / 2}px;border-radius:100px;width:${imageDim}px;height:${imageDim}px;" />
                   <div class="card" style="top:${outsideCircleDim / 2 + 10
              }px;position:absolute;height:30px;width:${d.width}px;background-color:#3AB6E3;">
                      <div style="background-color:${color};height:28px;text-align:center;padding-top:10px;color:#ffffff;font-weight:bold;font-size:16px">
                          ${d.data.name} 
                      </div>
                      <div style="background-color:#F0EDEF;height:28px;text-align:center;padding-top:10px;color:#424142;font-size:16px">
                          ${d.data.position} 
                      </div>
                   </div>
               </div>
  `;
          })
          .container(this.chartContainer.nativeElement) // Set container to the chart element
          .data(data)
          .render();

        // this.addEventListeners(); // Add event listeners after chart is created
      } else {
        console.error('Chart container element is not available.');
      }
    });
  }
}
