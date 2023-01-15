
function redirectBasic(){
    location.href = '/Checkout';
}

function openPaypal(){
    document.getElementById("BuyBtn").innerHTML = "Loading...";
    
    fetch('/Pay', {
        method: 'POST',
        body: JSON.stringify({
          
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        data.links.forEach((link) => {
          if(link.rel === 'approval_url'){
            window.location.href = link.href;
          }
        })
      });
}

function openFree(){
  location.href = '/demo';
}
    


