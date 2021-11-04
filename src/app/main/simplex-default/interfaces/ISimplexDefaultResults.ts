import { ISimplexDefault } from './ISimplexDefault';

export interface ISimplexDefaultResults {
  initialTable: { pivotColumnIndex: number; table: ISimplexDefault[] };
  auxTable: ISimplexDefault[];
  newTable: ISimplexDefault[];
}
