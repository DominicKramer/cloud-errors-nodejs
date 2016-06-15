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
var isString = require('../../lib/type-checkers/is-string.js');
var Fuzzer = require('../../utils/fuzzer.js');

test(
  'Fuzzing isString for type checking'
  , function ( t ) {

    var f = new Fuzzer();
    var callback = function ( returnValue ) {

      t.deepEqual(
        returnValue
        , false
        , 'The return value of fuzzed input should be false'
      );
    }

    f.fuzzFunctionForTypes(isString, ["string"], callback);

    t.deepEqual(
      isString(f.generate.string())
      , true
      , "The return value of isString with a valid string should be true"
    );

    t.end();
  }
);
