export interface NhanVienTomTat {
  tenNhanVien: string;
  email: string;
  anhDaiDien: string;
  tenViTri: string;
}

export interface ThongTinCaNhan {
  hoTen: string;
  ngaySinh: string;     // LocalDate → string
  gioiTinh: boolean;
  trinhDoChuyenMon: string;
}

export interface ThongTinLienHeCongViec {
  email: string;
  sdt: string;
  maNhanVien: number;
  tenPhongBan: string;
}

export interface AuditLog {
  maLog: number;
  nguoiThucHien: number | null;
  hanhDong: string;
  thoiGian: string;      // ISO string
  moTa: string;
  maNhanVien: number | null;
  trangThai: 'ThanhCong' | 'ThatBai';
}
export interface DoiMatKhauDto {
  matKhauHienTai: string;
  matKhauMoi: string;
  xacNhanMatKhau: string;
}
export interface ViTriCongViecDTO {
  id: number;
  tenViTri: string;
}
export interface CapNhatThongTinNhanVien {
  hoTen: string;
  anhDaiDien?: string;
  email: string;
  ngaySinh?: string; // yyyy-MM-dd
  sdt: string;
  gioiTinh?: boolean | null;
}

// profile-form.model.ts
export interface ThongTinNhanVienFormDto {
  maNhanVien: number;
  hoTen: string;
  anhDaiDien?: string;
  email: string;
  ngaySinh?: string;
  sdt: string;
  gioiTinh?: boolean;
  tenViTri: string;
  tenPhongBan: string;
}
