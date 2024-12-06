import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceService } from '../Service/service.service';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _userService: ServiceService,
    private _dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this.userForm = this._fb.group({
      first_name: [data?.first_name || '', Validators.required],
      last_name: [data?.last_name || '', Validators.required],
      position: [data?.position || '', Validators.required],
      skills: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    this.userForm = this._fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      position: ['', Validators.required],
      skills: this._fb.array([this.createSkillFormGroup()]),
    });
  }

  createSkillFormGroup(): FormGroup {
    return this._fb.group({
      title: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  get skills(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skills.push(this.createSkillFormGroup());
  }

  onFormSubmit() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      this._userService.addUser(formData).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('New User Created Successfully!!!');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          this._coreService.openSnackBar('Error occurred while creating user.');
          console.error(err);
        },
      });
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.skills.clear();
    this.addSkill();
  }

  closeDialog(): void {
    this._dialogRef.close();
  }
}
