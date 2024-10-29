interface Department {
  id: number;
  companyId?: number | null;
  deptName?: string | null;
  opHours?: string | null;
  locationId?: number | null;
  deptEmail?: string | null;
  phone?: string | null;
  fax?: string | null;
  mgrId?: number | null;
}

export default Department;
