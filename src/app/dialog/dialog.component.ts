import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';
import { CrudService } from '../services/crud.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],

})
export class DialogComponent implements OnInit {
  restaurantForm: FormGroup;
  originalFormData: any;
  showDeleteWarning: boolean = false;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogComponent>,
    public service: CrudService) {
    this.restaurantForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      cuisine: [''],
      phoneNumber: ['', Validators.pattern('^[0-9]{10}$')],
      openingHours: [''],
      website: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
    });
  }

  ngOnInit(): void {
    if (this.data.addOrEdit == "edit") {
      this.showDeleteWarning = false;
      this.restaurantForm.patchValue(this.data.mainData);
    } else if (this.data.addOrEdit == "delete") {
      this.showDeleteWarning = true;
    }
  }

  get f() { return this.restaurantForm.controls; }

  onSubmit() {
    // Check if the form is valid
    if (this.restaurantForm.invalid) {
      return;
    }

    if (this.data.addOrEdit == "edit") {
      this.service.updateRestaurant(this.data.mainData.id, this.restaurantForm.value).subscribe(data => {
        this.closeDialog();
        this.openSnackBar(data.name, 'updated successfully');

      });

    } else if (this.data.addOrEdit == "add") {
      this.service.addRestaurant(this.restaurantForm.value).subscribe(data => {
        this.closeDialog();
        this.openSnackBar(data.name, 'added successfully with the id ' + data.id);
      });
    }
  }

  deleteDetails() {
    let id = this.data.mainData.id;
    this.service.deleteRestaurantById(id).subscribe(data => {
      this.closeDialog();
      this.openSnackBar(data.name, 'deleted successfully');
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openSnackBar(data: string, action: string) {
    this._snackBar.open(data, action,{
      duration:5000
    });
  }
}
