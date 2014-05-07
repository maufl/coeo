System.paths['*'] = 'js/*.js';
System.import('es6/vm/app').then(function(app) {
  var A = new app.App();
  console.debug(A);
  ko.applyBindings(A);
})
