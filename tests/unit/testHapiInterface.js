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

var has = require('lodash.has');
var is = require('is');
var isFunction = is.fn;
var isObject = is.object;
var assert = require('assert');
var hapiInterface = require('../../src/interfaces/hapi.js');
var ErrorMessage = require('../../src/classes/error-message.js');
var Fuzzer = require('../../utils/fuzzer.js');
var EventEmitter = require('events').EventEmitter;
var Configuration = require('../fixtures/configuration.js');
var createLogger = require('../../src/logger.js');

describe('Hapi interface', function () {
  describe('Fuzzing the setup handler', function () {
    it('Should not throw when fuzzed with invalid types', function () {
      var f = new Fuzzer();
      assert.doesNotThrow(function () {
        f.fuzzFunctionForTypes(hapiInterface, ['object', 'object']);
        return;
      });
    });
  });
  describe('Providing valid input to the setup handler', function () {
    var givenConfig = {getVersion: function () {return '1';}};
    var plugin;
    beforeEach(function () {plugin = hapiInterface(null, givenConfig)});
    it('should have plain object as plugin', function () {
      assert(isObject(plugin));
    });
    it('plugin should have a register function property', function () {
      assert(has(plugin, 'register') && isFunction(plugin.register));
    });
    it('the plugin\'s register property should have an attributes property',
      function () {
        assert(has(plugin.register, 'attributes') &&
          isObject(plugin.register.attributes));
      }
    );
    it('the plugin\'s attribute property should have a name property',
      function () {
        assert(has(plugin.register.attributes, 'name'));
        assert.strictEqual(plugin.register.attributes.name,
          '@google/cloud-errors');
      }
    );
    it('the plugin\'s attribute property should have a version property',
      function () {
        assert(has(plugin.register.attributes, 'version'));
      }
    );
  });
  describe('hapiRegisterFunction behaviour', function () {
    var fakeServer;
    beforeEach(function () {fakeServer = new EventEmitter();});
    it('Should call sendError when the request-error event is emitted', function () {
      var fakeClient = {
        sendError: function ( errMsg ) {
          assert(errMsg instanceof ErrorMessage,
            'The value given to sendError should be an instance of Error message');
        }
      };
      var plugin = hapiInterface(fakeClient, {
        lacksCredentials: function () {
          return false;
        },
        getVersion: function () {
          return '1';
        },
        getServiceContext: function () {
          return {service: 'node'}
        }
      });
      plugin.register(fakeServer, null, null, null);
      fakeServer.emit('request-error');
    });
  });
  describe('Behaviour around the request/response lifecycle', function () {
    var EVENT = 'onPreResponse';
    var fakeServer, config, plugin, fakeClient = {sendError: function () {}};
    before(function () {
      config = new Configuration({
        projectId: 'xyz',
        serviceContext: {
          service: 'x',
          version: '1.x'
        }
      });
      config.lacksCredentials = function () {return false;};
      plugin = hapiInterface(fakeClient, config);
    });
    beforeEach(function () {
      fakeServer = new EventEmitter();
      fakeServer.ext = fakeServer.on;
    });
    afterEach(function () {
      fakeServer.removeAllListeners();
    });
    it('Should call continue when a boom preResponse is emitted', function (done) {
      plugin.register(fakeServer, null, function () {});
      fakeServer.emit(EVENT, {response: {isBoom: true}},
        {
          continue: function () {
            // The continue function should be called
            done();
          }
        }
      );
    });
    it('Should call sendError when a boom response is received', function (done) {
      var fakeClient = {
        sendError: function (err) {
          assert(err instanceof ErrorMessage);
          done();
        }
      };
      var plugin = hapiInterface(fakeClient, config);
      plugin.register(fakeServer, null, function () {});
      fakeServer.emit('onPreResponse', {response:{isBoom: true}});
    });
    it('Should call next when completing a request', function (done) {
      plugin.register(fakeServer, null, function (err) {
        // The next function should be called
        done();
      });
      fakeServer.emit(EVENT, {response: {isBoom: true}},
        {continue: function () {}});
    });
  });
});
