import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { DmatTable, DmatTableService } from 'dmat-table';
import { AppService } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { createCustomElement, WithProperties } from '@angular/elements';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DmatTableService]
})
export class AppComponent implements OnInit {

  showTable: boolean;
  updateTable: boolean;
  tableData: DmatTable = {
    headers: ['Name', 'Director', 'Gross', 'Budget', 'Run Time', 'Genre', 'Rating', 'Release Date', 'IMDB', 'Votes'],
    keys: ['Title', 'Director', 'WorldwideGross', 'ProductionBudget', 'RunningTime', 'Genre', 'Rating', 'ReleaseDate', 'IMDBRating', 'IMDBVotes'],
    metadata: {
      tableHeading: 'Movies List',
      rowButtons: true,
      pagination: {
        itemsPerPage: 11
      },
      filter: {
        filterId: 'moviesTable',
        filterColumnKey: ['Rating', 'Genre'],
        allFilters: [
          { name: 'Rating' },
          { name: 'PG-13', value: 'PG-13' },
          { name: 'R', value: 'R' },
          { name: 'G', value: 'G' },
          { name: 'Genre' },
          { name: 'Drama', value: 'Drama' },
          { name: 'Comedy', value: 'Comedy' },
          { name: 'Horror', value: 'Horror' },
        ],
        filterBy: []
      },
      sort: {
        sortColumnHeader: 'IMDB',
        order: 'desc'
      },
      //// size of table
      dimensions: {
        height: '630px',
        // width: '500px'
      }
    },
    data: []
  };

  constructor(
    private appService: AppService,
    private dmatTableService: DmatTableService,
    private domSanitizer: DomSanitizer,
    private injector: Injector,
    private ngZone: NgZone,
    public dialog: MatDialog
  ) {
    Window['app-component'] = {
      component: this, zone: this.ngZone,
      edit: (id) => this.edit(id),
      delete: (id) => this.delete(id)
    };
    if (!customElements.get('expansion-panel')) {
      const element = createCustomElement(ExpansionPanelComponent, { injector: this.injector });
      customElements.define('expansion-panel', element);
    }
  }

  ngOnInit(): void {
    this.tableData.metadata.filter.filterBy = this.dmatTableService.getFilter('moviesTable'); // getting applied filter from session storage
    this.getTableData();
  }

  getTableData() {
    setTimeout(() => {
      this.showTable = true;
      const moviesData = this.appService.getAllMovies();
      moviesData.forEach((m, i) => {

        this.tableData.data.push({
          ...m,
          onRowClickLink: '', // 'onRowClickLink' is an implicit key for on row click navigation to another route
          colorBar: m.Rating === 'R' ? 'red' : '', // 'colorBar' is an implicit key for color bars
          WorldwideGross: '$' + m.WorldwideGross, // can use pipes
          ProductionBudget: '$' + m.ProductionBudget, // can use pipes,
          ReleaseDate: m.ReleaseDate,
          RunningTime: (m.RunningTime ? m.RunningTime + ' mins' : null),
          IMDBRating: (m.IMDBRating >= 9 ? { value: m.IMDBRating, color: '#ff00f2' } : m.IMDBRating), // { value: string, color: string } can be applied to any key
          isExpandComponent: this.domSanitizer.bypassSecurityTrustHtml(`<expansion-panel content=${m.id}></expansion-panel>`),
          rowButtons: this.domSanitizer.bypassSecurityTrustHtml(
            `<span onclick="Window['app-component'].zone.run(() => { Window['app-component'].edit(\'${m.id}\'); })" style="font-size: 20px;padding: 5px;" class="material-icons">edit</span>` +
            `<span onclick="Window['app-component'].zone.run(() => { Window['app-component'].delete(\'${m.id}\'); });" style="font-size: 20px;padding: 5px;" class="material-icons">delete</span>`
          ),
        });
      });
      this.updateTable = !this.updateTable;
    }, 1000);
  }

  edit(id) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        action: 'Edit',
        id
      }
    });

    dialogRef.afterClosed().subscribe(rId => {
      console.log(`Edited Movie: ${rId}`);
    });
  }

  delete(id) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        action: 'Delete',
        id
      }
    });

    dialogRef.afterClosed().subscribe(rId => {
      if (rId) {
        this.tableData.metadata.filter.filterBy = this.dmatTableService.getFilter('moviesTable');
        const index = this.tableData.data.findIndex((x: any) => x.id.toString() === rId);
        if (index > -1) {
          this.tableData.data.splice(index, 1);
          this.updateTable = !this.updateTable;
        }
      }
    });
  }
}
