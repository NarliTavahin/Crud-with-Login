import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ServiceService } from '../Service/service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-read-user',
  templateUrl: './read-user.component.html',
  styleUrls: ['./read-user.component.css'],
})
export class ReadUserComponent implements OnInit {
  ReadUserForm!: FormGroup;

  constructor(
    private _fbRead: FormBuilder,
    private _userService: ServiceService,
    private _dialogRef: MatDialogRef<ReadUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.ReadUserForm = this._fbRead.group({
      id: [{ value: '', disabled: true }],
      first_name: [{ value: '', disabled: true }],
      last_name: [{ value: '', disabled: true }],
      position: [{ value: '', disabled: true }],
      skills: this._fbRead.array([]),
    });

    console.log('UserId:', this.data['userId']);

    this._userService.getUserById(this.data['userId']).subscribe((res) => {
      console.log('User data:', res);

      this.skills.clear();

      this.ReadUserForm.patchValue({
        id: res['id'],
        first_name: res['first_name'],
        last_name: res['last_name'],
        position: res['position'],
      });

      res['skills'].forEach((skill: any) => {
        this.addSkill(skill.title, skill.level);
      });
    });
  }

  get skills(): FormArray {
    return this.ReadUserForm.get('skills') as FormArray;
  }

  addSkill(title: string, level: string): void {
    const skillGroup = this._fbRead.group({
      title: [{ value: title, disabled: true }],
      level: [{ value: level, disabled: true }],
    });

    this.skills.push(skillGroup);
  }

  onClose(): void {
    this._dialogRef.close();
  }
}
