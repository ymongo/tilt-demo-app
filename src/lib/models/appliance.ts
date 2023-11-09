export interface UserAppliance extends ApplianceInfo {
  id: number;
  label: string;
  // type: ApplianceType;
  // workingHours: 0;
  // power: number;
  // minWorkingHours: 0;
  // maxWorkingHours: 0;
  // workingHoursIncrement: 0;
}

export enum ApplianceType {
  FRIDGE = 'Fridge',
  WASHING_MACHINE = 'Washing Machine',
  TV = 'TV',
  FREEZER = 'Freezer',
  DISHWASHER = 'Dishwasher',
  INDUCTION_STOVE = 'Induction Stove',
  SMALL_LIGHT = 'Small Light',
  BIG_LIGHT = 'Big Light'
}

export interface ApplianceInfo {
  type: ApplianceType;
  category: string;
  workingHours: 0;
  power: number;
  minWorkingHours: 0;
  maxWorkingHours: 0;
  workingHoursIncrement: 0;
}
