const resultText = document.getElementById("resultText");
const par = document.getElementById("outputText");
const headingName = document.getElementById("headingName");
const jobHeading = document.getElementById("jobHeading");
let prevPic = "./assets/images/team1.jpg";
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
    resultText.appendChild(btn);
    btn.addEventListener("click", () => {
        const doc = new jsPDF();

        doc.setFont("times");

        const img = document.getElementById('button-image');

        doc.setFillColor(173, 216, 230); // set the fill color to blue
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), 60, 'F');
        doc.addImage(img, 'JPEG', 10, 10, 40, 40);
        doc.setLineWidth(0.1);
        doc.setDrawColor(0, 0, 0);
        doc.rect(10, 10, 40, 40);

        doc.fromHTML(`<h2 style=\"color: black; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif\">
        ${JSON.parse(name)}</h2><h4 style=\"font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif\">${JSON.parse(job)}</h4>`, 55, 15);

        doc.fromHTML("<h3 style=\"color: black; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif\">Cover Letter</h3>", 90, 60);
        var strArr = doc.splitTextToSize(letter, 190);
        doc.text(strArr, 10, 70);

        doc.save("coverletter.pdf");
        
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

