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


  /**
	* Include socket.io client library
  **/
  var SocketClient = require('socket.io-client');

    /**
  * @ngdoc provider
  * @name SocketIOProvider
  * @function
  *
  * @description
  *
  * Used for send events on socket.io server and listen server events.
  */
  var SocketIOProvider = function () {
    /*
    * Private variables and methods
    */
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
	          _.$http.get(_.sessionUrl(), {withCredentials: true})
	            .success(function(data) {
	              _.io = _.socket.connect(_.socketUrl());
	              _.cb(cb, true);
	            })
	            .error(function(err) {
	              _.cb(cb, false);
	            });
	        } else {
            _.io = _.socket.connect(_.socketUrl());
            _.cb(cb, true);	        	
	        }
        }
    	},
      cb: function (cb, result, args) {
      	if (!args) args = [];
        if (angular.isFunction(cb)) cb(result, (args[0]||undefined), (args[1]||undefined), (args[2]||undefined), (args[3]||undefined), (args[4]||undefined), (args[5]||undefined),
	                  (args[6]||undefined), (args[7]||undefined), (args[8]||undefined), (args[9]||undefined));
        console.log('"cb" is not a function, result: ', result);
      }
    };  	
    /* Public methods */
		return {
      /**
      * @ngdoc method
      * @name SocketIOProvider#configure
      *
      * @description
      * Sets socket.io server params
      *   angular.module('myApp')
      *   .config(function(socketIOProvider) {
      *     var api = {
      *       protocol: 'http',
      *       host: 'localhost',
      *       port: 3000,
      *       path: '/basepath',
      *       sessionInit: '/auth/session'
      *     }
      *     socketIOProvider.configure(api);
      *   });
      *
      * @param {Object} params Mapping information about connection params.
      * @returns {Object} self
      */
			configure: function (params) {
				angular.extend(_.params, params);
        return this;
			},
      
	    $get: ['$http', '$rootScope', function($http, $rootScope) {
	    	_.$http = $http;
	      var p = {
	        on: function (event, cb, args) {
	          _.init(function (connected) {
	            if(connected) {
	              _.io.on(event, function (data) {
	                _.cb(cb, data, args);
	                if (!$rootScope.$$phase) $rootScope.$apply();
	              });
	            } else {

	            }
	          });
	        },
	        send: function (event, data, cb) {
	          _.init(function (connected) {
	            if (connected) { // если подключены, отправляем событие
	              _.io.emit(event, data, function (data) {
									if (cb) cb(data);
									if (!$rootScope.$$phase) $rootScope.$apply();
								});
	            } else { // иначе ставим в очередь
	            }
	          });
	        }
	      };
	      return p;
	    }]

	  };
	};
  /* SocketIOModule */
	angular.module('SocketIOModule', ['ng']).
   	provider('socketIO', SocketIOProvider);
};