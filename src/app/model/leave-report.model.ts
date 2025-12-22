export interface LeaveFilter {
  period: 'THANG_NAY' | 'QUY_NAY' | 'NAM_NAY';
  phongBanId?: number | null;
  loaiNghi?: string | null;
}
export interface LeaveDetail {
  avatar: string;
  tenNhanVien: string;
  email: string;
  tenPhongBan: string;
  tongNghiPhepNam: number;
  tongNghiBenh: number;
  nghiKhongLuongVuot: number;
  tongNgayNghi: number;
  soNgayConLai: number;
}
