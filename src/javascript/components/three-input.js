import {Element as PolymerElement} from '@polymer/polymer/polymer-element.js';

// Added "export" to export the MyApp symbol from the module
export class ThreeInput extends PolymerElement {

  // Define a string template instead of a `<template>` element.
  static get template() {
    return `<input type="number" value="[[value]]"/>`
  }

  constructor() {
    super();
    this.value = 4;
  }

  // properties, observers, etc. are identical to 2.x
  static get properties() {
    value: {
      Type: Number
    }
  }
}

customElements.define('three-input', ThreeInput);
