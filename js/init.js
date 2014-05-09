System.paths['*'] = 'js/*.js';
System.import('es6/vm/app').then(function(app) {
  var A = new app.App();
  window.app = A;
  console.debug(A);
  ko.applyBindings(A);
})
