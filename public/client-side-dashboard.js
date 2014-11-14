function fetchAndRenderObjectList() {
  // this is a preset AJAX GET
  // see how it gets called once when the page is fully loaded,
  // on line 31
  $.ajax({
    url: '/objects',
    type: 'GET',
    success: function(data, textStatus, jqXHR) {
      // remove all child nodes
      $('#list-of-objects').empty();

      // we'll just assume the response is JSON that's already
      // been parsed for us, and we'll iterate through it
      data.forEach(function(objectString) {
        // append a little HTML template string as a child node to the UL tag
        $('#list-of-objects').append("<li>" + objectString + "</li>");
      });
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // render an error message, replacing any current
      // contents of the UL
      $('#list-of-objects').html("<li>AJAX error: " + textStatus + "</li><li>" + errorThrown + "</li>");
    }
  });
}

// NOTE: all commands starting with the $ are hitting jQuery
// the enclosed function is run one time, once the DOM is all ready
// http://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
  fetchAndRenderObjectList();

  // bind the enclosed function to the form submission event, which
  // can be triggered with an enter or clicking the submit button
  $('form#dashboard-form').submit(function(event) {

    // prevent the form from being submitted by the browser
    event.preventDefault();

    // get values from form fields
    // NOTE: .val() with no parameters reads the current value
    // and .val('text') with one string paramter sets the value to 'text'
    var url = $('#http-url').val();
    var method = $('#http-method').val();
    var contentType = $('#http-content-type').val();
    var body = $('#http-body').val();

    // run the AJAX request
    $.ajax({
      url: url,
      type: method,
      contentType: contentType,
      data: body,
      success: function(data, textStatus, jqXHR) {
        // asynchronous success callback
        // we're assuming that the response is JSON, so we turn it into
        // a string representation and dump it into the DOM
        var jsonAsString = JSON.stringify(data);
        $('#http-response').text(jsonAsString);

        // NOTE: we'll automatically refresh the list of objects, even
        // though it's probably not relevant to do after all requests
        fetchAndRenderObjectList();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // asynchronous error callback
        // render a template string into the DOM
        $('#http-response').html("<h2>AJAX error: " + textStatus + "</h2><p>" + errorThrown + "</p>");
        // NOTE: notice how this is rendering HTML tags into the DIV: http://api.jquery.com/html/#html2
        // while the success callback is rendering unformatted text into the DIV: http://api.jquery.com/text/#text2
      }
    });
  });
});
