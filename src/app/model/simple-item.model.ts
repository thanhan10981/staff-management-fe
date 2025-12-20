export interface SimpleItem {
  id: number;
  name: string;
}

export interface TyLeDiTrePhongBanChart {
  label: string;
  value: number;
}


export interface TongNgayCongResponse {
  tuNgay: string;
  denNgay: string;
  tongSoNgayCong: number;
}

export interface TongLanDiTreResponse {
  tuNgay: string;
  denNgay: string;
  tongSoLanDiTre: number;
}

export interface TongNghiKhongPhepResponse {
  tuNgay: string;
  denNgay: string;
  tongSoNghiKhongPhep: number;
}

export interface TiLeDungGioResponse {
  tuNgay: string;
  denNgay: string;
  tiLeDungGio: number;      // 0 → 100 (BE trả dạng %)
  tongSoLanDiLam: number;
  soLanDungGio: number;
}

export interface TongNgayCongTheoThangItem  {
  thang: number;        // 1..12
  tongNgayCong: number;
}

export interface TyLeDiTrePhongBanChart {
  tenPhongBan: string;
  tiLe: number;
}

export interface AttendanceDetail {
tenNhanVien: string;
email: string;
tenPhongBan: string;
tenViTri: string;
ngayCong: string; // ISO date
coDiLam: number; // 0 | 1
diTre: number; // minutes
nghiKhongPhep: number; // 0 | 1
nghiCoPhep: number; // 0 | 1
}
