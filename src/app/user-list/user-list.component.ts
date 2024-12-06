import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { User } from '../Modals/api-modals';

import { ServiceService } from '../Service/service.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { ReadUserComponent } from '../read-user/read-user.component';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { CoreService } from '../core/core.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})

export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'position',
    'skills',
    'action',
  ];

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Root: any;

  constructor(
    private _Service: ServiceService,
    private _dialog: MatDialog,
    private _coreService: CoreService,
    private _authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}


  // -----------------------------------applyFilter--------------------------------------------

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getUserList();
    console.log('UserListComponent initialized');
  }

  getUserList() {
    this._Service.getUserList().subscribe({
      next: (res) => {
        console.log(res);
        this.Root = res;
        this.dataSource = new MatTableDataSource(this.Root);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: console.error,
    });
  }

  // -----------------------------------Create--------------------------------------------

  openDialog() {
    const dialogRef = this._dialog.open(CreateUserComponent, {
      width: '400px',
      data: {
        id: '',
        first_name: '',
        last_name: '',
        position: '',
        skills: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getUserList();
      }
    });
  }

  // -----------------------------------Read User--------------------------------------------
  openReadUserDialog(userId: number): void {
    this._dialog.open(ReadUserComponent, {
      data: { userId: userId },
    });
  }
  // -----------------------------------Update User--------------------------------------------

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(UpdateUserComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
        }
      },
    });
  }

  // -----------------------------------Delete--------------------------------------------

  deleteUser(id: number): void {
    this._Service.deleteUser(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('User Deleted Successfully !!!');
        console.log('User Deleted Successfully !!!');
        this.getUserList();
      },
      error: (err) => {
        this._coreService.openSnackBar('Error Deleting User !!!!');

        console.error('Error deleting user:', err);
      },
    });
  }

  // -----------------------------------LogOUT--------------------------------------------

  onLogout(): void {
    this._authService.logout();
  }
}
