export interface IAttendeeData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email?: string;
  phoneNumber?: string;
  discount: number;
  discountReason: string;
}

export interface IAttendeeDataIndex {
  index: number;
  data: IAttendeeData;
}

export interface IAddRowResponse {
  status: string;
}
