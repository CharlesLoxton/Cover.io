const btnUpload = document.getElementById("btnUpload");
const inputFile = document.getElementById("inputFile");
const resultText = document.getElementById("resultText");
let selectedFileName = document.getElementById("fileSelected");
let loading  = false;

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

window.onload = function() {

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var paymentId = urlParams.get('paymentId');
    var token = urlParams.get('token');
    var PayerID = urlParams.get('PayerID');
    var code = urlParams.get('code');

    fetch("/verifyPayment", {
      method: "post",
      body: JSON.stringify({
        paymentId,
        token,
        PayerID,
        code
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
        return response.text();
    }).then(data => {
      console.log(data);
      if(JSON.parse(data).status == "Approved"){
        loading = true;
        btnUpload.style.display = "none";
        var storedValue = sessionStorage.getItem("letter");

        if(storedValue != null){
          if(resultText.value == ""){
          writeLetter(storedValue);
        }
        };
      }
    })    
}

btnUpload.addEventListener("click", () => {
    
    if(loading) return;
    if(inputFile.files[0] == null) return;

    resultText.value = "";
    btnUpload.innerHTML = "Loading..."
    const formData = new FormData();

    formData.append("avatar", inputFile.files[0]);
    loading = true;

    fetch("/upload", {
        method: "post",
        body: formData
    }).then(response => {
        return response.text();
    }).then(extractedText => {

        if(extractedText == "An error occurred, please try again"){
          loading = false;
          btnUpload.innerHTML = "Upload";
          writeLetter(extractedText);
        } else {
          execute(extractedText);
        }
        
    })    
});

function writeLetter(text) {
    let index = 0;

    const interval = setInterval(() => {
        resultText.value += text[index];
        index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 25);
}

inputFile.addEventListener("change", (event) => {
    selectedFileName.innerHTML = event.target.value;
    console.log("File foudn");
})

function copyText() {
    navigator.clipboard.writeText(resultText.value).then(function() {
      console.log('Text copied to clipboard');
    }, function(err) {
      console.error('Error copying text: ', err);
    });
}

function execute(text){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var paymentId = urlParams.get('paymentId');
    var token = urlParams.get('token');
    var PayerID = urlParams.get('PayerID');
    var code = urlParams.get('code');

    fetch("/execute", {
      method: "post",
      body: JSON.stringify({
        paymentId,
        token,
        PayerID,
        code
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
        return response.text();
    }).then(data => {
      if(JSON.parse(data).status == "Success"){
        writeLetter(text);
        loading = true;
        btnUpload.innerHTML = "Upload";
        btnUpload.style.display = "none";
        sessionStorage.setItem("letter", text);
      } else {
        writeLetter("Error with payment, check your balance or reselect the Basic package and try again...");
        loading = false;
        btnUpload.innerHTML = "Upload";
        btnUpload.style.display = "none";
      }
    })    
}

