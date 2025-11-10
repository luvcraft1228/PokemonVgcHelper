import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

/**
 * Module core contenant les services et fonctionnalités essentielles de l'application.
 * Importé uniquement dans AppModule.
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [HttpClientModule],
})
export class CoreModule {}

