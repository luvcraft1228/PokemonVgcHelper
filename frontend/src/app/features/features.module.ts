import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

/**
 * Module features contenant les modules de fonctionnalités métier.
 * Structure à étendre avec auth, teams, dashboard, etc.
 */
@NgModule({
  imports: [CommonModule, SharedModule],
})
export class FeaturesModule {}

