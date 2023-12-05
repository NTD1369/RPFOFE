import {Injectable} from '@angular/core';
import { CanDeactivate } from '@angular/router'; 
import { ManagementItemEditComponent } from '../management/masterdata/item/management-item-edit/management-item-edit.component';
 
@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<ManagementItemEditComponent> {
    // tslint:disable-next-line: typedef
    canDeactivate(component: ManagementItemEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue?  Any unsaved changes will be lost');
        }
        return true;
    }
}
