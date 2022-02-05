let simplemdeJQuery = null

if (typeof jQuery !== 'undefined') {
  simplemdeJQuery = jQuery
} else if (typeof django !== 'undefined') {
  //use jQuery come with django admin
  simplemdeJQuery = django.jQuery
} else {
  console.error(
    'cant find jQuery, please make sure your have jQuery imported before this script'
  )
}

if (simplemdeJQuery) {
  simplemdeJQuery(function () {
    const boxes = simplemdeJQuery('.simplemde-box')
    simplemdeJQuery.each(boxes, function (i, elem) {
      const elOptions = simplemdeJQuery(elem).attr('data-simplemde-options')
      const options = elOptions ? JSON.parse(elOptions) : {}
      options['element'] = elem
      const simplemde = (elem.SimpleMDE = new SimpleMDE(options))
      // Fix Markdown Editor responsive flow
      elem.parentNode.classList.add('mde-container')
    })
  })
}
