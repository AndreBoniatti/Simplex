import { ISimplexDefault } from './ISimplexDefault';
import { ISimplexDefaultInitialTable } from './ISimplexDefaultInitialTable';

export interface ISimplexDefaultResults {
  initialTable: ISimplexDefaultInitialTable;
  auxTable: ISimplexDefault[];
  newTable: ISimplexDefault[];
}
