const resultText = document.getElementById("resultText");
const par = document.getElementById("outputText");
let letter = "";

window.onload = function() {
    var queryString = window.location.search;
    console.log(queryString);
    var urlParams = new URLSearchParams(queryString);
    var param = urlParams.get('text');

    JSON.parse(param).forEach((element) => {
        letter += element;
        letter += "\n\n";
        let node = document.createElement("p");
        node.style.fontSize = "15px";
        node.innerHTML = "";
        writeLetter(node, element);
        resultText.appendChild(node);
    })

    let btn = document.createElement("button");
    btn.classList.add("button-style");
    btn.innerHTML = "Save";
    resultText.appendChild(btn);
    btn.addEventListener("click", () => {
        const doc = new jsPDF();
        var strArr = doc.splitTextToSize(letter, 190)
        doc.text(strArr, 10, 10);
        doc.save('coverletter.pdf');
    });

    let copyBtn = document.createElement("button");
    copyBtn.classList.add("button-style");
    copyBtn.style.marginLeft = "10px";
    copyBtn.innerHTML = "Copy";
    resultText.appendChild(copyBtn);
    copyBtn.addEventListener("click", () => {
        copyText();
    });
}

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

function writeLetter(node, text) {

  let index = 0;

  const interval = setInterval(() => {
    node.innerHTML += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 25);
}

function copyText() {
    navigator.clipboard.writeText(letter).then(function() {
      console.log('Text copied to clipboard');
    }, function(err) {
      console.error('Error copying text: ', err);
    });
  }

