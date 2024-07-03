import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-action-cell-renderer',
    template: `
    <span>
      <button class="btn btn-primary action-btn" (click)="onEditClick()">edit
      
      </button> 
     <button class="btn btn-primary action-btn" (click)="onDeleteClick()">delete
     </button>
     </span>
  `,
    styleUrl: './admin-page.component.scss'

})
export class ActionCellRendererComponent implements ICellRendererAngularComp {

    private params: any;

    constructor() { }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return true;
    }

    onEditClick(): void {
        if (this.params.onEdit) {
            this.params.onEdit(this.params.data);
        }
    }

    onDeleteClick(): void {
        if (this.params.onDelete) {
            this.params.onDelete(this.params.data);
        }
    }
}
