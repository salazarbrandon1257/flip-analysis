export interface ExpenseEntry {
  id: string;
  dealId: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  createdAt: Date;
}

export const EXPENSE_CATEGORIES = [
  'Flooring',
  'Painting',
  'Plumbing',
  'Electrical',
  'Roofing',
  'HVAC',
  'Cabinetry',
  'Countertops',
  'Landscaping',
  'Demolition',
  'Foundation',
  'Windows & Doors',
  'Insulation',
  'Drywall',
  'Cleanup/Debris',
  'Permits',
  'Other',
];
