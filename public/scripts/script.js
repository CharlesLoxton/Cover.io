const btnUpload = document.getElementById("btnUpload");
const inputFile = document.getElementById("inputFile");
const resultText = document.getElementById("resultText");
let selectedFileName = document.getElementById("fileSelected");
let loading  = false;

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

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
        writeLetter(extractedText);
        console.log(extractedText);
        loading = false;
        btnUpload.innerHTML = "Upload";
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

