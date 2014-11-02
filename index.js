/**
* @license AngularIO v0.0.0
* (c) Aleksandr Korolev
* License: MIT
*/
module.exports = function (angular, undefuned) {
	  /**
  * @ngdoc module
  * @name ngSocketIO
  * @description
  *
  * # ngSocketIO
  *
  * The `ngSocketIO` module provides work with socket.io library.
  *
  * ## Example
  *
  *
  */
  /* global -ngSocketIOModule */

  /**
	* Include socket.io client library
  **/
  var SocketClient = require('socket.io-client');
  var SocketIOProvider = function () {
    var _ = {
    	socket: SocketClient,
    	params: {
    		protocol: 'http',
    		host: 'localhost',
    		port: 80,
    		path: '',
    		sessionInit: '/auth/session'
    	},
    	socketUrl: function () {
    		_.socketURL = _.socketURL || _.params.protocol+"://"+_.params.host+(_.params.port>0?":"+_.params.port:"")+_.params.path;
    		return _.socketURL;
    	},
    	sessionUrl: function () {
    		_.sessionURL = _.sessionURL || _.params.protocol+"://"+_.params.host+(_.params.port>0?":"+_.params.port:"")+_.params.sessionInit;
    		return _.sessionURL;
    	},
    	io: false,
    	init: function (cb) {
    		if (_.io) {
            _.cb(cb, true);
        } else {
          if (_.sessionUrl()) {
	          _.$http.get(_.sessionUrl())
	            .success(function(data) {
	              _.io = _.socket.connect(_.socketUrl());
	              _.cb(cb, true);
	            })
	            .error(function(err) {
	              _.cb(cb, false)
	            });
	        } else {
            _.io = _.socket.connect(_.socketUrl());
            _.cb(cb, true);	        	
	        }
        }
    	},
      cb: function (cb, result, args) {
      	var args = args || [];
        if (angular.isFunction(cb)) cb(result, (args[0]||undefined), (args[1]||undefined), (args[2]||undefined), (args[3]||undefined), (args[4]||undefined), (args[5]||undefined),
	                  (args[6]||undefined), (args[7]||undefined), (args[8]||undefined), (args[9]||undefined));
        console.log('"cb" is not a function, result: ', result);
      }
    };  	
		return {
			configure: function (params) {
				angular.extend(_.params, params);
			},
	    $get: ['$http', '$rootScope', function($http, $rootScope) {
	    	_.$http = $http;
	      var p = {
	        on: function (event, cb, args) {
	          _.init(function (connected) {
	            if(connected) {
	              _.io.on(event, function (data) {
	                _.cb(cb, data, args);
	                $rootScope.$apply();
	              });
	            } else {

	            }
	          });
	        },
	        send: function (event, data, cb) {
	          _.init(function (connected) {
	            if (connected) { // если подключены, отправляем событие
	              _.io.emit(event, data, cb);
	            } else { // иначе ставим в очередь
	            }
	          });
	        }
	      };
	      return p;
	    }]

	  };
	}
	SocketIOModule = angular.module('SocketIOModule', ['ng']).
   	provider('socketIO', SocketIOProvider);
}