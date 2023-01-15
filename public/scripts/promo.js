const form = document.getElementById("promo-form");

form.addEventListener("submit", function(event) {
    event.preventDefault(); // prevent the form from submitting
    const searchTerm = document.getElementById("searchTerm").value;
    const url = `/promo?code=${searchTerm}`;
    fetch(url)
      .then(response => response.text())
      .then(data => {
        if(JSON.parse(data).status == 200){
            window.location.href = `/Create?code=${searchTerm}`;
        }
      });
  });