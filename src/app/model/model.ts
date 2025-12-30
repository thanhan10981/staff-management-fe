export interface EmployeeModel {
  maNhanVien: string;
  tenNhanVien: string;
  ngaySinh: string;
  gioiTinh: string;
  sdt: string;
  email: string;
  trangThai: string;

  maViTri: string;
  maPhongBan: string;
  maKhoa: string;
  sdtLienHeKhanCap: string;
  tenViTri: string;
  tenPhongBan: string;
  tenKhoa: string;
  lienHeKhanCap: string;
  cccd: string;
  ngayVaoLam: string;
  trinhDoChuyenMon: string;
  anhDaiDien:string;
  hopDongFile: string;
}

export interface PhanCongCaTruc {
  maPhanCong: number;
  maNhanVien: number;
  hoTen: string;
  maCa: number;
  maPhong: number;
  maKhoa: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  lapLaiHangTuan: number;
  trangThai: number;
  ghiChu: string;
}
export interface LichTrucNgay {
  maLichTruc: number;
  maNhanVien: number;
  hoTen: string;
  maCa: number;
  maPhong: number;
  ngayTruc: string;
  trangThai: string;
  ghiChu: string;
}
export interface CaLamViec {
  maCa?: number;
  tenCa: string;
  gioBatDau: string; // "07:00:00"
  gioKetThuc: string;
  phuCap?: number;
}

export interface LichTruc {
  maLichTruc?: number;
  maNhanVien: number;
  hoTen?: string;
  maCa: number;
  tenCa?: string;
  maPhong: number;
  ngayTruc: string; // "2025-11-16"
  trangThai?: string;
  ghiChu?: string;
}

export interface PhanCongRequest {
  maPhong: number | null;
  maCa: number | null;
  ngayTruc: string | null;
  danhSachNhanVien: number[];
}

export interface LichTrucTuanDTO {
  maNhanVien: number;
  hoTen: string;
  tenPhong: string;
  maKhoa: number;
  maPhongBan: number;
  maViTri: number;
  lichTheoNgay: Record<string, string>; 
}

export interface UserView {
  maNguoiDung: number;
  tenDangNhap: string;
  vaiTro: string;
  permissions: number[];
  trangThai: string;
  maNhanVien?: number;
}

export interface SystemLog {
  maLog: number;
  tenDangNhap: string;
  vaiTro: string;
  thoiGian: string;
  hanhDong: string;
  trangThai: string;
}

export interface ShiftSwapRequestModel {
  maYeuCau: number;
  nguoiGui: number;
  tenNguoiGui: string;
  nguoiNhan: number;
  tenNguoiNhan: string;
  maCa: number;
  tenCa: string;
  tenPhongBan?: string;
  ngayTruc: string;
  lyDo: string;
  trangThai: string;
}

export interface ShiftSwapRequestCreateModel {
  nguoiGui: number;
  nguoiNhan: number;
  maCa: number;
  ngayTruc: string;
  lyDo: string;
}
export interface EmployeeOption {
  maNhanVien: number;
  tenNhanVien: string;
}

export interface ShiftOption {
  maCa: number;
  tenCa: string;
}

export interface ShiftSwapCreateForm {
  nguoiGui: number;
  tenNguoiGui: string;

  maCaHienTai: number;
  tenCaHienTai: string;

  nhanVienOptions: EmployeeOption[];
  caOptions: ShiftOption[];
}

export interface ShiftSwapDetailModel {
  maYeuCau: number;

  nguoiGui: number;
  tenNguoiGui: string;

  nguoiNhan: number;
  tenNguoiNhan: string;

  ngayTruc: string;

  tenCaHienTai: string;
  tenCaMuonDoi: string;

  lyDo: string;
  trangThai: string;
}

export interface ApprovalModel {
  id: number;

  loaiYeuCau: 'NghiPhep' | 'DoiCa';

  maNhanVien: number;
  tenNhanVien: string;

  thoiGian: string;   // vd: 2025-02-01 → 2025-02-03
  chiTiet: string;   // vd: Ca sáng → Ca chiều
  lyDo: string;
}

