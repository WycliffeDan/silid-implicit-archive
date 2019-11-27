// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************



// Delete window.fetch on every window load
//Cypress.on('window:before:load', win => {
//  delete win.fetch;
////  win.fetch = require('react-app-polyfill/stable');
//  Cypress.log({
//    name: 'Deleting Fetch',
//  });
//
////  win.fetch = require('whatwg-fetch');
//});

import './login'
import './log'
