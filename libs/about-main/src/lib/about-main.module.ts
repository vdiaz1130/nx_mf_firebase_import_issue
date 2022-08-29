import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutMainComponent } from './about-main-component/about-main.component';
import {SharedComponentsModule} from "@ng-module-federation/shared-components";

import { DocumentSnapshot } from '@angular/fire/compat/firestore';
import { OrderByDirection, WhereFilterOp } from 'firebase/firestore';

export interface WhereCondition {
  field: string;
  operator: WhereFilterOp;
  value: string | number;
}

export interface OrderByCondition {
  field: string;
  order?: OrderByDirection;
}

export interface FirestoreQuery<T> {
  limit?: number;
  startAt?: number | string | DocumentSnapshot<T>;
  startAfter?: number | string | DocumentSnapshot<T>;
  endAt?: number | DocumentSnapshot<T>;
  endBefore?: number | DocumentSnapshot<T>;
  orderBy?: OrderByCondition[];
  where?: WhereCondition[];
}


@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutMainComponent,
      },
    ]),
  ],
  declarations: [AboutMainComponent],
})
export class AboutMainModule {}
