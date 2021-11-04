import { Injectable } from '@angular/core';
import { ISimplexDefault } from './interfaces/ISimplexDefault';
import { ISimplexDefaultResults } from './interfaces/ISimplexDefaultResults';
import { ISimplexDefaultValues } from './interfaces/ISimplexDefaultValues';

@Injectable({
  providedIn: 'root',
})
export class SimplexDefaultService {
  stages: ISimplexDefaultResults[] = [];

  getStages(simplexValues: ISimplexDefaultValues): ISimplexDefaultResults[] {
    this.stages = [];
    this.setStages(simplexValues);

    return this.stages;
  }

  private setStages(simplexValues: ISimplexDefaultValues): void {
    let pivotColumnIndex: number = this.getPivotColumnIndex(
      simplexValues.zMax.variables
    );

    if (pivotColumnIndex != -1) {
      let pivotLineIndex: number = this.getPivotLineIndex(
        simplexValues.restrictions,
        pivotColumnIndex
      );

      if (pivotLineIndex != -1) {
        let stage: ISimplexDefaultResults = {
          initialTable: {
            pivotColumnIndex: pivotColumnIndex,
            table: [],
          },
          auxTable: [],
          newTable: [],
        };

        stage.initialTable.table = this.getInitialTable(
          simplexValues,
          pivotLineIndex
        );

        stage.auxTable = this.getAuxTable(
          simplexValues,
          pivotLineIndex,
          pivotColumnIndex
        );

        this.stages.push(stage);
      }
    }
  }

  private getPivotColumnIndex(variables: number[]): number {
    let index: number = -1;

    for (let i = 0; i < variables.length; i++) {
      if (variables[i] < 0) {
        index = i;
        break;
      }
    }

    return index;
  }

  private getPivotLineIndex(
    restrictions: ISimplexDefault[],
    columnIndex: number
  ): number {
    let index: number = -1;
    let lowestValue: number = 0;
    let results: { value: number; index: number }[] = [];

    for (let i = 0; i < restrictions.length; i++) {
      if (restrictions[i].variables[columnIndex] != 0) {
        let value: number =
          restrictions[i].constant / restrictions[i].variables[columnIndex];

        results.push({
          value: value,
          index: i,
        });

        if (index == -1) {
          index = i;
          lowestValue = value;
        }
      } else {
        results.push({
          value: null,
          index: i,
        });
      }
    }

    let positiveResults: { value: number; index: number }[] = results.filter(
      (x) => {
        return x.value >= 0 && x.value != null;
      }
    );

    for (let i = 0; i < positiveResults.length; i++) {
      if (positiveResults[i].value < lowestValue) {
        index = positiveResults[i].index;
        lowestValue = positiveResults[i].value;
      }
    }

    return index;
  }

  private getInitialTable(
    simplexValues: ISimplexDefaultValues,
    pivotLineIndex: number
  ): ISimplexDefault[] {
    let table: ISimplexDefault[] = [];

    table.push(simplexValues.zMax);
    for (let i = 0; i < simplexValues.restrictions.length; i++) {
      let restriction: ISimplexDefault = simplexValues.restrictions[i];
      restriction.isPivotColumn = i == pivotLineIndex;

      table.push(restriction);
    }

    return table;
  }

  private getAuxTable(
    simplexValues: ISimplexDefaultValues,
    pivotLineIndex: number,
    pivotColumnIndex: number
  ): ISimplexDefault[] {
    let table: ISimplexDefault[] = [];

    let pivotRestriction: ISimplexDefault =
      simplexValues.restrictions[pivotLineIndex];

    let intersectionValue: number =
      pivotRestriction.variables[pivotColumnIndex];

    table.push({
      label: `X${pivotColumnIndex + 1}`,
      constant: pivotRestriction.constant / intersectionValue,
      variables: pivotRestriction.variables.map((x) => {
        return x / intersectionValue;
      }),
    });

    return table;
  }
}
