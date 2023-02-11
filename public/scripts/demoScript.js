const demoBtn = document.getElementById("demoBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resultText = document.getElementById("resultText");
const heading = document.getElementById("outputHeading");
const userName = document.getElementById("userName");
const headingName = document.getElementById("headingName");
const jobInput = document.getElementById("job");
const jobHeading = document.getElementById("jobHeading")
let loading  = false;
let letter = [];
let prevPic = "";

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

demoBtn.addEventListener("click", () => {
    
    if(loading) return;

    letter = "";

    const name = document.getElementById("userName").value;
    const job = document.getElementById("job").value;
    const skills = document.getElementById("skills").value;
    const education = document.getElementById("education").value;
    const experience = document.getElementById("experience").value;

    demoBtn.innerHTML = "Loading...";
    deleteNodes();
    let node = document.createElement("h6");
    let bold = document.createElement("b");
    node.style.textAlign = "center";
    resultText.appendChild(node);
    node.appendChild(bold);
    bold.innerHTML = "Generating...";
    loading = true;

    let params = {
      name,
      job,
      skills,
      education,
      experience
    }

    fetch("/freeupload", {
        method: "post",
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.text();
    }).then(extractedText => {
        
      deleteNodes();
      let node = document.createElement("h6");
      let bold = document.createElement("b");
      node.style.textAlign = "center";
      resultText.appendChild(node);
      node.appendChild(bold);
      bold.innerHTML = "Cover Letter";

      letter = JSON.parse(extractedText).text;

      JSON.parse(extractedText).text.forEach((element) => {
        let node = document.createElement("p");
        node.id = "noCopy";
        node.style.fontSize = "15px";
        node.innerHTML = "";
        writeLetter(node, element);
        resultText.appendChild(node);
      })
        loading = false;
        demoBtn.innerHTML = "Upload";

        if(JSON.parse(extractedText).error == false){
          let btn = document.createElement("button");
          btn.classList.add("downloadBtn");
          btn.id = "downloadBtn";
          btn.innerHTML = "Save PDF ($0.49)";
          resultText.appendChild(btn);
          btn.addEventListener("click", () => {
            payDemo();
          });
        }
    })  
    .catch((err) => {
      loading = false;
      demoBtn.innerHTML = "Upload";
      console.log(err);
    })  
});

function payDemo() {
  const name = document.getElementById("userName").value;
  const job = document.getElementById("job").value;

  fetch('/PayDemo', {
    method: 'POST',
    body: JSON.stringify({
      text: letter,
      name,
      job
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

function deleteNodes() {
  resultText.innerHTML = "";
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

userName.addEventListener("input", function() {

  if(userName.value === ""){
    headingName.innerHTML = "John Doe";
  } else {
    headingName.innerHTML = userName.value;
  }
});

jobInput.addEventListener("input", function() {

  if(jobInput.value === ""){
    jobHeading.innerHTML = "Software Developer";
  } else {
    jobHeading.innerHTML = jobInput.value;
  }
});
