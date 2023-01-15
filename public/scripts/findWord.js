function highlightSearchTerm() {
    // Get the search term from the input field
    var searchTerm = document.getElementById('search-input').value;
  
    // Find all the <p> elements on the page
    var paragraphs = document.getElementsByTagName('p');
  
    // Loop through the <p> elements
    for (var i = 0; i < paragraphs.length; i++) {
      var p = paragraphs[i];
  
      // Get the text of the <p> element
      var pText = p.innerText;
  
      // Find all occurrences of the search term in the <p> element
      var searchTermIndex = pText.indexOf(searchTerm);
      while (searchTermIndex != -1) {
        // Highlight the search term
        var span = document.createElement('span');
        span.classList.add('highlight');
        span.innerText = searchTerm;
  
        // Replace the search term with the highlighted span
        pText = pText.substring(0, searchTermIndex) + span.outerHTML + pText.substring(searchTermIndex + searchTerm.length);
  
        // Find the next occurrence of the search term
        searchTermIndex = pText.indexOf(searchTerm, searchTermIndex + span.outerHTML.length);
      }
  
      // Update the <p> element with the highlighted search term
      p.innerHTML = pText;
    }
  }

  document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted
    console.log("searching for " + document.getElementById('search-input').value)
    highlightSearchTerm();
  });
  
  