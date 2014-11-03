angular.io
==========

AngularJS provider for work with socket.io library.

## Install

```shell
npm install angular.io
```

## Use in HTML

Not supported in this version, to be release in next versions.

## Use with browserify

```javascript
var angular = require('angular');
require('angular.io')(angular);
angular.module('myApp', ['SocketIOModule']);
```

### Configurate

```javascript
  angular.module('myApp')
    .config(function(socketIOProvider) {
      var params = {
				protocol: 'http',
				host: 'localhost',
				port: 3000,
				path: '',
				sessionInit: '/auth/session'
			}
      socketIOProvider.configure(params);
    });
```

### Send data from server and listen server events.

```javascript
  angular.module('myApp')
    .controller('myController',['$scope', 'socketIO', function ($scope, socket) {
    	$scope.sendMsg = function (msg) {
    		// send any data from server
    		socket.send('msg', {msg: msg}, $scope.callback);
    	}
    	socket.on('newmsg', function(data) {
    		// use data
    	})
    });
```
