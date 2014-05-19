System.paths['*'] = 'js/*.js';
System.import('es6/vm/app').then(function(app) {
  var A = new app.App();
  window.app = A;
  console.debug(A);
  $('script[data-template-src]').each(function(i,e) {
    $.get($(e).data('templateSrc'), function(tmpl) {
      $(e).html(tmpl)
    })
  })
  ko.applyBindings(A);
})
