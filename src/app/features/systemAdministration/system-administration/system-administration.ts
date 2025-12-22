  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { PermissionService } from '../../../service/permission.service';
  import { UserService } from '../../../service/user.service';
import { UserView } from '../../../model/model';
import { EmployeeService } from '../../../service/employees';
import { RouterModule } from '@angular/router';


  @Component({
    selector: 'app-system-administration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
    templateUrl: './system-administration.html',
    styleUrl: './system-administration.scss',
  })
  export class SystemAdministrationComponent implements OnInit {

    users: UserView[] = [];
    filteredUsers: UserView[] = [];
    permissions: any[] = [];
    nhanViens: any[] = [];              
    selectedPermissions: number[] = [];
    

    isShowModal = false;
    isEditMode = false;
    editingUserId: number | null = null;
    filterRole = '';
    filterPermission = '';


    form: FormGroup;

    constructor(
      private fb: FormBuilder,
      private permissionService: PermissionService,
      private userService: UserService,
      private employeeService: EmployeeService 
    ) {
      this.form = this.fb.group({
        tenDangNhap: [''],
        matKhau: [''],
        vaiTro: [''],
        maNhanVien: [''],
        isSystemAdmin: [false]
      });
    }

    ngOnInit() {
      this.loadUsers();
      this.loadPermissions();
      this.loadNhanViens(); 
    }

    loadNhanViens() {
  this.employeeService.getAllEmployees().subscribe({
    next: res => {
      this.nhanViens = res;
    },
    error: err => {
      console.error('LOAD EMPLOYEE FAIL', err);
      this.nhanViens = [];
    }
  });
}


    /* ================= LOAD DATA ================= */

    loadUsers() {
    this.userService.getAll().subscribe(res => {
      this.users = res.map(u => ({
        ...u,
        permissions: u.permissionIds ?? []
      }));
      this.filteredUsers = [...this.users];
    });
  }


    loadPermissions() {
  this.permissionService.getAll().subscribe({
    next: res => {
      this.permissions = res;
    },
    error: err => {
      console.error('LOAD PERMISSION FAIL', err);
      this.permissions = []; 
    }
  });
}

    getPermissionName(maQuyen: number): string {
    const p = this.permissions.find(x => x.maQuyen === maQuyen);
    return p ? p.tenQuyen : '';
  }


    /* ================= MODAL ================= */

    openAdd() {
      this.isEditMode = false;
      this.editingUserId = null;
      this.form.reset({
        isSystemAdmin: false
      });
      this.selectedPermissions = [];
      this.isShowModal = true;
    }

    openEdit(user: any) {
      this.isEditMode = true;
      this.editingUserId = user.maNguoiDung;

      this.form.patchValue({
        tenDangNhap: user.tenDangNhap,
        vaiTro: user.vaiTro,
        maNhanVien: user.maNhanVien,
        isSystemAdmin: !user.maNhanVien && user.vaiTro === 'QuanTriVien'
      });

      this.selectedPermissions = user.permissionIds ?? [];
      this.isShowModal = true;
    }

    close() {
      this.isShowModal = false;
      this.form.reset();
      this.selectedPermissions = [];
      this.isEditMode = false;
      this.editingUserId = null;
    }

    /* ================= PERMISSION ================= */

    onPermissionChange(event: any) {
      const value = +event.target.value;
      if (event.target.checked) {
        if (!this.selectedPermissions.includes(value)) {
          this.selectedPermissions.push(value);
        }
      } else {
        this.selectedPermissions = this.selectedPermissions.filter(v => v !== value);
      }
    }

    /* ================= SUBMIT ================= */

    submit() {
  console.log('=== SUBMIT CLICKED ===');
  console.log('Form value:', this.form.value);
  console.log('Selected permissions:', this.selectedPermissions);
  console.log('isEditMode:', this.isEditMode);
  console.log('editingUserId:', this.editingUserId);

  const payload: any = {
    tenDangNhap: this.form.value.tenDangNhap,
    vaiTro: this.form.value.vaiTro,
    permissionIds: this.selectedPermissions
  };

  // chỉ gửi mật khẩu khi tạo mới
  if (!this.isEditMode) {
    payload.matKhau = this.form.value.matKhau;
  }

  // chỉ gửi mã nhân viên khi không phải admin hệ thống
  if (
    this.form.value.vaiTro !== 'QuanTriVien' ||
    !this.form.value.isSystemAdmin
  ) {
    payload.maNhanVien = this.form.value.maNhanVien;
  }

  console.log('FINAL PAYLOAD SENT TO BE:', payload);

  // ================= UPDATE =================
  if (this.isEditMode && this.editingUserId) {
    this.userService.updateUser(this.editingUserId, payload).subscribe({
      next: () => {
        console.log('UPDATE USER SUCCESS');
        this.showToast('Cập nhật người dùng thành công');
        this.close();
        this.loadUsers();
      },
      error: err => {
        console.error('UPDATE USER FAIL:', err);
        this.showToast('Cập nhật người dùng thất bại', 'error');
      }
    });
    return;
  }

  // ================= CREATE =================
  this.userService.createUser(payload).subscribe({
    next: () => {
      console.log('CREATE USER SUCCESS');
      this.showToast('Thêm người dùng thành công');
      this.close();
      this.loadUsers();
    },
    error: err => {
      console.error('CREATE USER FAIL:', err);
      this.showToast('Thêm người dùng thất bại', 'error');
    }
  });
}



    // ================= FILTER =================

    applyFilter() {
      this.filteredUsers = this.users.filter(u => {

        // lọc theo vai trò
        const matchRole =
          !this.filterRole || u.vaiTro === this.filterRole;

        // lọc theo quyền
        const matchPermission =
          !this.filterPermission ||
          (u.permissions && u.permissions.includes(+this.filterPermission));

        return matchRole && matchPermission;
      });
    }
    selectedIds: number[] = [];
    
/* xóa nhiều */
deleteSelected() {
  console.log('Xóa các user:', this.selectedIds);
  // gọi API xóa theo list id
}




// ===== STATE =====
showConfirm = false;
selectedUser: UserView | null = null;


// ===== TOAST =====
toastMessage = '';
toastType: 'success' | 'error' = 'success';
showToastBox = false;

// ===== TOAST FUNC =====
showToast(msg: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = msg;
  this.toastType = type;
  this.showToastBox = true;

  setTimeout(() => {
    this.showToastBox = false;
  }, 500);
}

// ===== CHECKBOX =====
toggleOne(id: number) {
  this.selectedIds.includes(id)
    ? (this.selectedIds = this.selectedIds.filter(x => x !== id))
    : this.selectedIds.push(id);
}

toggleAll(event: any) {
  this.selectedIds = event.target.checked
    ? this.filteredUsers.map(u => u.maNguoiDung)
    : [];
}

isAllChecked(): boolean {
  return (
    this.filteredUsers.length > 0 &&
    this.selectedIds.length === this.filteredUsers.length
  );
}

// ===== MỞ CONFIRM =====
confirmDeleteOne(user: UserView) {
  this.selectedUser = user;
  this.showConfirm = true;
}

confirmDeleteSelected() {
  if (this.selectedIds.length === 0) return;
  this.selectedUser = null;
  this.showConfirm = true;
}

// ===== HUỶ =====
cancelDelete() {
  this.showConfirm = false;
  this.selectedUser = null;
}

// ===== XOÁ THẬT =====
confirmDelete() {

  // ===== XOÁ 1 =====
  if (this.selectedUser) {
    const id = this.selectedUser.maNguoiDung;

    this.userService.deleteOne(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.maNguoiDung !== id);
        this.applyFilter();
        this.showToast('Xóa người dùng thành công');
        this.cancelDelete();
      },
      error: () => this.showToast('Xóa thất bại', 'error')
    });

    return;
  }

  // ===== XOÁ NHIỀU =====
  if (this.selectedIds.length > 0) {
    this.userService.deleteMany(this.selectedIds).subscribe({
      next: () => {
        this.users = this.users.filter(
          u => !this.selectedIds.includes(u.maNguoiDung)
        );
        this.selectedIds = [];
        this.applyFilter();
        this.showToast('Xóa người dùng thành công');
        this.cancelDelete();
      },
      error: () => this.showToast('Xóa thất bại', 'error')
    });
  }
}
  }
