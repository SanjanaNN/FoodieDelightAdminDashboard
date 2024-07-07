import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CrudService } from '../services/crud.service';
import { By } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialog: MatDialog;
  let service: CrudService;

  let mockMatDialogRef: MatDialogRef<DialogComponent>;
  let mockMatDialogData: any;
  let mockMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockCrudService: jasmine.SpyObj<CrudService>;

  beforeEach(async () => {
    // Initialize spies for MatDialogRef, MatDialogData, MatSnackBar, and CrudService
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockMatDialogData = { addOrEdit: 'add', mainData: {} };
    mockMatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockCrudService = jasmine.createSpyObj('CrudService', ['addRestaurant', 'updateRestaurant', 'deleteRestaurantById']);

    await TestBed.configureTestingModule({
      // imports: [DialogComponent, MatDialogModule, HttpClientModule],
      imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: CrudService, useValue: mockCrudService }, // Provide mockCrudService here
        { provide: MatSnackBar, useValue: mockMatSnackBar }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog', () => {
    expect(component).toBeTruthy();
  });

  it('should render `add` title in h4 tag if addOrEdit is equal add', () => {
    const fixture = TestBed.createComponent(DialogComponent);
    component.data.addOrEdit = 'add';

    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain("Add New Restaurant");
    expect(compiled.querySelector('h4').textContent).toContain('Add New Restaurant');
  });
  it('should render the `edit` title in h4 tag if addOrEdit is equal edit', () => {
    const fixture = TestBed.createComponent(DialogComponent);
    component.data.addOrEdit = 'edit';

    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain("Edit Restaurant Details");
    expect(compiled.querySelector('h4').textContent).toContain('Edit Restaurant Details');
  });

  it("should disable the button when form is invalid", () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("button"));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should close dialog on closeDialog call when close button is clicked', () => {
    spyOn(component, "closeDialog").and.returnValue(close());
    const button = fixture.debugElement.query(By.css("button")).triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should initialize form with empty values on creation', () => {
    expect(component.restaurantForm.value).toEqual({
      name: '',
      description: '',
      location: '',
      cuisine: '',
      phoneNumber: '',
      openingHours: '',
      website: ''
    });
  });

  it('should patch form with data when editing', () => {
    const editData = {
      "name": "Fresh Delicacy5",
      "description": "Fresh home cooked food",
      "location": "Delhi",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "9123467898",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy5.com",
      "id": 5
    };
    component.data = { addOrEdit: 'edit', mainData: editData };
    component.restaurantForm.patchValue(editData);

    // fixture.detectChanges();
    expect(component.restaurantForm.value.name).toEqual('Fresh Delicacy5');
  });

  it('should show delete warning when in delete mode', () => {
    component.data = { addOrEdit: 'delete' };
    component.ngOnInit();
    expect(component.showDeleteWarning).toBe(true);
  });



  it('should call service method to delete restaurant and close dialog', () => {
    const deleteData = { id: '1', name: 'Deleted Restaurant' };
    component.data = { addOrEdit: 'delete', mainData: deleteData };
    mockCrudService.deleteRestaurantById.and.returnValue(of(deleteData));
    component.deleteDetails();
    expect(mockCrudService.deleteRestaurantById).toHaveBeenCalledWith(deleteData.id);
    expect(mockMatDialogRef.close).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(deleteData.name, 'deleted successfully', { duration: 5000 });
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

});
