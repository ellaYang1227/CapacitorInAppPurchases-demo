import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadioRoutingModule } from './radio-routing.module';
import { RadioComponent } from './radio.component';

import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    RadioComponent
  ],
  imports: [
    CommonModule,
    RadioRoutingModule,
    IonicModule
  ]
})
export class RadioModule { }
