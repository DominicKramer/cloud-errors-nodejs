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

var test = require('tape');
var isNumber = require('../../lib/type-checkers/is-number.js');
var Fuzzer = require('../../utils/fuzzer.js');

test(
  'Fuzzing isNumber for type checking'
  , function ( t ) {

    var f = new Fuzzer();
    var callback = function ( returnValue ) {

      t.deepEqual(
        returnValue
        , false
        , 'The return value of fuzzed input should be false'
      );
    }

    f.fuzzFunctionForTypes(isNumber, ["number"], callback);

    t.deepEqual(
      isNumber(f.generate.number())
      , true
      , "The return value of isNumber with a valid number should be true"
    );

    t.end();
  }
)
