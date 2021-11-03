import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IRestrictionsValues } from './interfaces/IRestrictionsValues';
import { ISimplexDefault } from './interfaces/ISimplexDefault';
import { ISimplexDefaultResults } from './interfaces/ISimplexDefaultResults';
import { ISimplexDefaultValues } from './interfaces/ISimplexDefaultValues';
import { IZMaxValues } from './interfaces/IZMaxValues';
import { SimplexDefaultService } from './simplex-default.service';

@Component({
  templateUrl: './simplex-default.component.html',
  styleUrls: ['./simplex-default.component.css'],
})
export class SimplexDefaultComponent implements OnInit {
  zMax: FormArray;
  restrictions: FormArray;

  displayedColumns: string[] = [];
  dataSource: ISimplexDefaultResults[] = [];

  zMaxForm: FormGroup = this._formBuilder.group({
    zMax: this._formBuilder.array([this.addZMaxGroup()]),
  });

  restrictionsForm: FormGroup = this._formBuilder.group({
    restrictions: this._formBuilder.array([this.addRestrictionsGroup()]),
  });

  constructor(
    private _formBuilder: FormBuilder,
    private _simplexDefaultService: SimplexDefaultService
  ) {}

  ngOnInit(): void {
    this.zMax = this.zMaxForm.get('zMax') as FormArray;
    this.restrictions = this.restrictionsForm.get('restrictions') as FormArray;
  }

  private addZMaxGroup(): FormGroup {
    return this._formBuilder.group({
      nonBasicVariable: [0],
    });
  }

  addNonBasicVariable(): void {
    this.zMax.push(this.addZMaxGroup());

    for (let i = 0; i < this.restrictions.controls.length; i++) {
      let nonBasicVariables = <FormArray>(
        this.restrictions.controls[i].get('nonBasicVariables')
      );

      nonBasicVariables.push(this.addNonBasicVariableFromRestrictions());
    }
  }

  removeLastNonBasicVariable(): void {
    let zMaxControlsLength: number = this.zMax.controls.length;
    this.zMax.removeAt(zMaxControlsLength - 1);

    for (let i = 0; i < this.restrictions.controls.length; i++) {
      let nonBasicVariables = <FormArray>(
        this.restrictions.controls[i].get('nonBasicVariables')
      );

      nonBasicVariables.removeAt(nonBasicVariables.length - 1);
    }
  }

  private addRestrictionsGroup(): FormGroup {
    return this._formBuilder.group({
      constant: [0],
      nonBasicVariables: this._formBuilder.array([
        this.addNonBasicVariableFromRestrictions(),
      ]),
    });
  }

  private addNonBasicVariableFromRestrictions(): FormGroup {
    return this._formBuilder.group({
      variable: [0],
    });
  }

  addRestriction(): void {
    let newRestriction: FormGroup = this.addRestrictionsGroup();
    let zMaxControlsLength: number = this.zMax.controls.length;

    for (let i = 1; i < zMaxControlsLength; i++) {
      let nonBasicVariables = <FormArray>(
        newRestriction.get('nonBasicVariables')
      );

      nonBasicVariables.push(this.addNonBasicVariableFromRestrictions());
    }

    this.restrictions.push(newRestriction);
  }

  removeLastRestriction(): void {
    let restrictionsLength: number = this.restrictions.controls.length;
    this.restrictions.removeAt(restrictionsLength - 1);
  }

  generateResults(): void {
    this.resetTables();
    let simplexValues: ISimplexDefaultValues = this.getSimplexValues();
    this.setDisplayedColumns(simplexValues);

    let stages: ISimplexDefaultResults[] =
      this._simplexDefaultService.getStages(simplexValues);

    this.dataSource = stages;
  }

  resetTables(): void {
    this.dataSource = [];
    this.displayedColumns = [];
  }

  getSimplexValues(): ISimplexDefaultValues {
    let zValues: IZMaxValues[] = [];
    zValues = this.zMax.getRawValue();

    let restrictionValues: IRestrictionsValues[] = [];
    restrictionValues = this.restrictions.getRawValue();

    let simplexValues: ISimplexDefaultValues = {
      zMax: {
        label: 'Z',
        variables: zValues.map((x) =>
          +x.nonBasicVariable != 0
            ? Math.sign(x.nonBasicVariable) * -Math.abs(x.nonBasicVariable)
            : 0
        ),
        constant: 0,
      },
      restrictions: [],
    };

    restrictionValues.forEach((x) => {
      simplexValues.zMax.variables.push(0);

      let restriction: ISimplexDefault = {
        label: `X${simplexValues.zMax.variables.length}`,
        variables: x.nonBasicVariables.map((x) => +x.variable),
        constant: x.constant,
      };

      for (let i = 0; i < restrictionValues.length; i++) {
        if (simplexValues.restrictions.length == i) {
          restriction.variables.push(1);
        } else {
          restriction.variables.push(0);
        }
      }

      simplexValues.restrictions.push(restriction);
    });

    return simplexValues;
  }

  setDisplayedColumns(simplexValues: ISimplexDefaultValues): void {
    this.displayedColumns.push('var-basic');
    for (let i = 0; i < simplexValues.zMax.variables.length; i++) {
      this.displayedColumns.push(`X${i + 1}`);
    }
    this.displayedColumns.push('const');
  }
}
