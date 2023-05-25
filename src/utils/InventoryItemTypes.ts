export interface InventoryItem {
  _id?: string;
  itemName: string;
  category: string;
  itemCode: string;
  itemDescription: string;
  unit: string;
  openingStock: number;
  asOfDate: string;
  lowStockWarning: boolean;
  lowStockUnits: number;
  purchasePrice: number;
  inclusiveOfTax: boolean;
  gstTaxRate: number;
  images:string[]
}
