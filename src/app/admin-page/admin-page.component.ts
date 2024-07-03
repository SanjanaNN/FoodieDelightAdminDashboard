import { Component, OnInit } from '@angular/core';
import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { CrudService } from '../services/crud.service';
import { AgGridAngular } from 'ag-grid-angular';
@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgGridAngular],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {

  // Row Data: The data to be displayed.
  rowData: any = [];
  defaultColDef;
  gridApi: any;
  paginationPageSize = 20;
  // Column Definitions: Defines the columns to be displayed.
  colDefs: any;
  gridColumnApi: any;
  paginationNumberFormatter: (params: any) => string;
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };
  constructor(private fb: FormBuilder, public dialog: MatDialog, public service: CrudService) {
    this.colDefs = [
      { headerName: 'Id', field: "id", width: 80 },
      { headerName: 'Name', field: "name" },
      { headerName: 'Description', field: "description" },
      { headerName: 'Location', field: "location", width: 120 },
      { headerName: 'Phone No', field: "phoneNumber", width: 120 },
      { headerName: 'Opening Hours', field: "openingHours" },
      { headerName: 'Website', field: "website" },
      { headerName: 'Cuisine', field: "cuisine", width: 80 },
      {
        headerName: 'Actions', cellRenderer: 'actionCellRenderer', maxWidth: 150, cellRendererParams: {
          onEdit: this.onEdit.bind(this),
          onDelete: this.onDelete.bind(this)
        }
      }

    ];
    this.defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true
    };

    this.paginationNumberFormatter = function (params) {
      return "[" + params.value.toLocaleString() + "]";
    };

  }
  ngOnInit(): void {
    this.getAllRestaurants();
  }

  openDialog(action: string, reqdata: object) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { addOrEdit: action, mainData: reqdata },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllRestaurants();
    });

  }

  onPageSizeChanged() {
    let value = (<HTMLInputElement>document.getElementById("page-size")).value;
    this.gridApi.paginationSetPageSize(Number(value));

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onEdit(data: any): void {

    this.openDialog("edit", data)
  }

  onDelete(data: any): void {

    this.openDialog("delete", data);
  }

  getAllRestaurants() {
    this.service.getAllRestaurants().subscribe(data => {
      this.rowData = data;
    });
  }


  exportData() {
    const params = {
      columnKeys: [
        'id',
        'name',
        'location',
        'description',
        'cuisine',
        'phoneNumber',
        'openingHours',
        'website'
      ],
      fileName: 'Restaurant List'
    };
    this.gridApi.exportDataAsCsv(params);

  }

}


