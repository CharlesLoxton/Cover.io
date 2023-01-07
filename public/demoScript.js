const demoBtn = document.getElementById("demoBtn");
const resultText = document.getElementById("resultText");
const heading = document.getElementById("outputHeading");
let loading  = false;

let currentYear = new Date().getFullYear();
document.getElementById("date").innerHTML += `${currentYear} ai-cover | All rights reserved`;

demoBtn.addEventListener("click", () => {
    
    if(loading) return;

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

      JSON.parse(extractedText).text.forEach((element) => {
        console.log(element);
        let node = document.createElement("p");
        node.style.fontSize = "15px";
        node.innerHTML = "";
        writeLetter(node, element);
        resultText.appendChild(node);
      })
        loading = false;
        demoBtn.innerHTML = "Upload";
    })    
});

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
