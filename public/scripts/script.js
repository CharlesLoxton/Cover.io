const btnUpload = document.getElementById("btnUpload");
const inputFile = document.getElementById("inputFile");
const resultText = document.getElementById("resultText");
let selectedFileName = document.getElementById("fileSelected");
let loading  = false;

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

window.onload = function() {

    var storedValue = sessionStorage.getItem("letter");

    if(storedValue != null){
      if(resultText.value == ""){
        btnUpload.style.display = "none";
        writeLetter(storedValue);
      }
    };
}

btnUpload.addEventListener("click", () => {
    
    if(loading) return;
    if(inputFile.files[0] == null) return;

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var paymentId = urlParams.get('paymentId');
    var token = urlParams.get('token');
    var PayerID = urlParams.get('PayerID');
    var code = urlParams.get('code');

    resultText.value = "";
    btnUpload.innerHTML = "Loading..."
    const formData = new FormData();

    formData.append("avatar", inputFile.files[0]);
    formData.append("paymentId", paymentId);
    formData.append("token", token);
    formData.append("PayerID", PayerID);
    formData.append("code", code);
    loading = true;

    fetch("/upload", {
        method: "post",
        body: formData
    }).then(response => {
        return response.text();
    }).then(data => {

      if(JSON.parse(data).status == 200){
        writeLetter(JSON.parse(data).text);
        loading = false;
        btnUpload.innerHTML = "Upload";
        btnUpload.style.display = "none";
        sessionStorage.setItem("letter", JSON.parse(data).text);
      } else {
        writeLetter(JSON.parse(data).text);
        loading = false;
        btnUpload.innerHTML = "Upload";
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

