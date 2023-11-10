import { z } from 'zod';

export interface UserAppliance {
  id: string;
  name: string;
  type: string;
  category: string;
  workingHours: number;
  power: number;
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

export const UserApplianceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.string().min(1),
  category: z.string().min(1),
  workingHours: z.number(),
  power: z.number()
});
