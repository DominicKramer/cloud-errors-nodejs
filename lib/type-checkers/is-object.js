/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-env node */
'use strict';
var isFunction = require('./is-function.js');

/**
 * Checks the input for type. If input is of type function then the function
 * will return true, otherwise the function will return false.
 * @function isObject
 * @param {Any} varToCheck - the variable to check the type of
 * @returns {Boolean} - Returns true if input is of type object, otherwise false
 */
function isObject ( varToCheck ) {

  return Boolean(varToCheck) && typeof varToCheck === 'object' &&
    isFunction(varToCheck.hasOwnProperty) && !Array.isArray(varToCheck);
}

module.exports = isObject;
