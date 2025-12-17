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

