export type CourseType = 'antipasto' | 'primo' | 'secondo' | 'dolce' | 'bevande';

export interface MenuItem {
  id: string;
  course: CourseType;
  name: string;
  description: string;
  allergens: string[];
  order: number;
}

export interface MenuBycourse {
  antipasto: MenuItem[];
  primo: MenuItem[];
  secondo: MenuItem[];
  dolce: MenuItem[];
  bevande: MenuItem[];
}