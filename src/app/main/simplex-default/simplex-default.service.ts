import { Injectable } from '@angular/core';
import { ISimplexDefaultResults } from './interfaces/ISimplexDefaultResults';
import { ISimplexDefaultValues } from './interfaces/ISimplexDefaultValues';

@Injectable({
  providedIn: 'root',
})
export class SimplexDefaultService {
  getStages(simplexValues: ISimplexDefaultValues): ISimplexDefaultResults[] {
    let stages: ISimplexDefaultResults[] = [];

    stages.push(this.addStage(simplexValues));

    return stages;
  }

  private addStage(
    simplexValues: ISimplexDefaultValues
  ): ISimplexDefaultResults {
    let stage: ISimplexDefaultResults = {
      initialTable: [],
      auxTable: [],
      newTable: [],
    };

    stage.initialTable.push(simplexValues.zMax);
    simplexValues.restrictions.forEach((x) => {
      stage.initialTable.push(x);
    });

    return stage;
  }
}
