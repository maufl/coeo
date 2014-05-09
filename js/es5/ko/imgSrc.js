ko.bindingHandlers.imgSrc = {
  init: function(element, optionsAccessor, allBindingsAccessor, viewModel) {
    var img = optionsAccessor()
    element.src = img.src
  },
  update: function(element, optionsAccessor, allBindingsAccessor, viewModel) {
    var img = optionsAccessor()
    element.src = img.src
  }
}
