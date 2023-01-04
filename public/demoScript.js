const demoBtn = document.getElementById("demoBtn");
const inputFile = document.getElementById("inputFile");
const resultText = document.getElementById("resultText");
let selectedFileName = document.getElementById("fileSelected");
let file;
let loading  = false;

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;


function uploadFile() {

    console.log(file);

    const reader = new FileReader();

    reader.onload = function(e) {
        const fileData = e.target.result;
        // send the file data to the Node.js server using fetch
        fetch('/uploaddemo', {
          method: 'POST',
          body: fileData,
          headers: {
            'Content-Type': 'false',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('File uploaded successfully');
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
      };
      reader.readAsArrayBuffer(file);
}

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
    file = inputFile.files[0];
})

function copyText() {
    navigator.clipboard.writeText(resultText.value).then(function() {
      console.log('Text copied to clipboard');
    }, function(err) {
      console.error('Error copying text: ', err);
    });
}