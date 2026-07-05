export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: any;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  type: 'shop' | 'house' | 'flat' | 'office' | 'warehouse';
  totalUnits: number;
  createdAt: any;
}

export interface Unit {
  id: string;
  ownerId: string;
  propertyId: string;
  unitName: string;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';
  rentAmount: number;
  createdAt: any;
}

export interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  cnic?: string;
  email?: string;
  createdAt: any;
}

export interface Agreement {
  id: string;
  ownerId: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  rentAmount: number;
  startDate: any;
  endDate?: any;
  status: 'ACTIVE' | 'ENDED';
  createdAt: any;
}

export interface RentRecord {
  id: string;
  ownerId: string;
  agreementId: string;
  unitId: string;
  tenantId: string;
  month: number;
  year: number;
  rentAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  dueDate: any;
  createdAt: any;
}

export interface RentPayment {
  id: string;
  ownerId: string;
  rentRecordId: string;
  amount: number;
  paymentDate: any;
  method?: string;
  createdAt: any;
}

export interface Expense {
  id: string;
  ownerId: string;
  propertyId?: string;
  category: string;
  amount: number;
  description?: string;
  date: any;
  createdAt: any;
}