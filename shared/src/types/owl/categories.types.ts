import { v4 as uuidv4 } from "uuid";

export class Category {
  id: string;
  name: string = "";
  parentID: string | null;
  priority: number | null;
  itemsCount?: number;
  constructor() {
    this.id = uuidv4();
    this.name = "";
    this.parentID = null;
    this.priority = 0;
    this.itemsCount = 0;
  }
}
