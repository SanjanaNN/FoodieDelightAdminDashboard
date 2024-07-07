import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPageComponent } from './admin-page.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CrudService } from '../services/crud.service';
import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;
  let mockRestaurants = [
    {
      "id": "1",
      "name": "Fresh Delicacy1",
      "location": "Bengaluru",
      "description": "Fresh home cooked food",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "902346789",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy1.com"
    },
    {
      "name": "Fresh Delicacy2",
      "description": "Fresh home cooked food",
      "location": "Mysore",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "9120467898",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy2.com",
      "id": "2"
    },
    {
      "id": "4",
      "name": "Fresh Delicacy4",
      "location": "Bengaluru",
      "description": "Fresh home cooked food",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "912340089",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy4.com"
    },
    {
      "name": "Fresh Delicacy5",
      "description": "Fresh home cooked food",
      "location": "Delhi",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "9123467898",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy5.com",
      "id": "5"
    }];
  let mockDialog: MatDialog;
  let mockCrudService: CrudService;
  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
    mockCrudService = jasmine.createSpyObj('CrudService', ['getAllRestaurants']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, CommonModule, AgGridAngular, MatDialogModule, HttpClientModule],
      providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: CrudService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminPageComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch restaurants on initialization', () => {
    const mockData = mockRestaurants;
    (mockCrudService.getAllRestaurants as jasmine.Spy).and.returnValue(of(mockData));

    component.ngOnInit();
    expect(component.rowData).toEqual(mockData);
  });
  it('should open dialog on openDialog call when edit is clicked', () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
    component.openDialog('edit', {});
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open dialog on openDialog call when add is clicked', () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
    component.openDialog('add', {});
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should open dialog on openDialog call when delete is clicked', () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
    component.openDialog('delete', {});
    expect(component.dialog.open).toHaveBeenCalled();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPageComponent);
    component = fixture.componentInstance;
    mockDialog = TestBed.inject(MatDialog);
    mockCrudService = TestBed.inject(CrudService);
    spyOn(mockCrudService, 'getAllRestaurants').and.returnValue(of(mockRestaurants)); // Mock service response
    fixture.detectChanges();
  });
  it('should call openDialog with "edit"', () => {
    spyOn(component, 'openDialog');
    component.onEdit({});
    expect(component.openDialog).toHaveBeenCalledWith('edit', {});
  });

  it('should export data as CSV', () => {
    const mockGridApi = jasmine.createSpyObj('gridApi', ['exportDataAsCsv']);
    component.gridApi = mockGridApi;
    component.exportData();
    expect(mockGridApi.exportDataAsCsv).toHaveBeenCalled();
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
    expect(mockGridApi.exportDataAsCsv).toHaveBeenCalledWith(params);
  });
 
  it('should change pagination page size', () => {
    const mockPageSizeElement = document.createElement('input');
    mockPageSizeElement.id = 'page-size';
    mockPageSizeElement.value = '50';
    document.body.appendChild(mockPageSizeElement);

    const mockGridApi = jasmine.createSpyObj('gridApi', ['paginationSetPageSize']);
    component.gridApi = mockGridApi;

    component.onPageSizeChanged();

    expect(mockGridApi.paginationSetPageSize).toHaveBeenCalled();
    expect(mockGridApi.paginationSetPageSize).toHaveBeenCalledWith(50);

    document.body.removeChild(mockPageSizeElement);
  });

});


describe('ActionCellRendererComponent', () => {
  let component: ActionCellRendererComponent;
  let fixture: ComponentFixture<ActionCellRendererComponent>;
  let mockRestaurants = [
    {
      "id": "1",
      "name": "Fresh Delicacy1",
      "location": "Bengaluru",
      "description": "Fresh home cooked food",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "902346789",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy1.com"
    },
    {
      "name": "Fresh Delicacy2",
      "description": "Fresh home cooked food",
      "location": "Mysore",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "9120467898",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy2.com",
      "id": "2"
    },
    {
      "id": "4",
      "name": "Fresh Delicacy4",
      "location": "Bengaluru",
      "description": "Fresh home cooked food",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "912340089",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy4.com"
    },
    {
      "name": "Fresh Delicacy5",
      "description": "Fresh home cooked food",
      "location": "Delhi",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "9123467898",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy5.com",
      "id": "5"
    }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger onEditClick', () => {
    const mockData = mockRestaurants;
        const mockParams = {
      data: mockData,
      onEdit: jasmine.createSpy('onEdit')
    };
    
    component.agInit(mockParams); // Initialize the component with mock params
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('.action-btn');
    editButton.click(); 
    expect(mockParams.onEdit).toHaveBeenCalledWith(mockData);
  });

  it('should create button with onDeleteClick functionality', () => {
    const mockData = mockRestaurants;
        const mockParams = {
      data: mockData,
      onDelete: jasmine.createSpy('onDelete') 
    };
    
    component.agInit(mockParams); // Initialize the component with mock params

    const deleteButton = fixture.nativeElement.querySelector('.action-btn');
    expect(deleteButton).toBeTruthy();
  });


});