ko.bindingHandlers.prettyTime = {
  update: function(element, valueAccessor) {
    var value = ko.unwrap(valueAccessor())
    if (value !== null && moment(value).isValid())
      $(element).text(moment(value).fromNow())
  }
}
