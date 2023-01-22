const resultText = document.getElementById("resultText");
const par = document.getElementById("outputText");
const headingName = document.getElementById("headingName");
const jobHeading = document.getElementById("jobHeading");
const btnArea = document.getElementById("saveButtonArea");
let prevPic = "./assets/images/AIwriting.png";
let letter = "";

window.onload = function() {
    var queryString = window.location.search;
    console.log(queryString);
    var urlParams = new URLSearchParams(queryString);
    var param = urlParams.get('text');
    var job = urlParams.get('job');
    var name = urlParams.get('name');

    console.log(name);
    headingName.innerHTML = JSON.parse(name);
    jobHeading.innerHTML = JSON.parse(job);
    document.querySelector("#button-image").src = prevPic;

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
    btn.id = "saveBtn";
    resultText.appendChild(btn);
    btn.addEventListener("click", () => {

      const divToCapture = document.querySelector("#pdfOutput");
      const saveBtn = document.querySelector("#saveBtn");
      const copyBtn = document.querySelector("#copyBtn");
      const originalWidth = divToCapture.style.width;
      
      saveBtn.style.display = "none";
      copyBtn.style.display = "none";
      divToCapture.style.width = "700px"

        html2canvas(divToCapture).then(canvas => {

          // Create a new instance of jsPDF
          const doc = new jsPDF();

          doc.setFillColor(240, 240, 240); 
          doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    
          // Add the image of the div element to the pdf
          doc.addImage(canvas.toDataURL('image/png'), 'PNG', 12, 20);
    
          // Save the pdf
          doc.save("coverletter.pdf");
          divToCapture.style.width = originalWidth;
          saveBtn.style.display = "inline";
          copyBtn.style.display = "inline";
        });
        
    });

    let copyBtn = document.createElement("button");
    copyBtn.classList.add("button-style");
    copyBtn.style.marginLeft = "10px";
    copyBtn.id = "copyBtn";
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

  document.querySelector("#image-button").addEventListener("click", function() {
    document.querySelector("#file-input").click();
  });

  document.querySelector("#file-input").addEventListener("change", function() {
    let file = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
  
    reader.onloadend = function() {
      prevPic = reader.result;
      document.querySelector("#button-image").src = reader.result;
    }
  
    if (file) {
      reader.readAsDataURL(file);
    } else {
      if(prevPic != ""){
        document.querySelector("#button-image").src = prevPic;
      } else{
        document.querySelector("#button-image").src = "./assets/images/team1.jpg";
      }
      
    }
  });

