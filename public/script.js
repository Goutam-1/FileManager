let delet=document.getElementById("delete")
let newFolder=document.getElementById("folder")
let rename=document.getElementById('rename')
let scn=document.getElementsByClassName("main")
let newFile=document.getElementById("file")
let inp=document.getElementById("search")
let uploadBtn = document.getElementById("uploadBtn")
let fileInput = document.getElementById("fileInput")



document.addEventListener("click", (e) => {
  if (e.target.closest("div")?.classList.contains("folder")) {
      document.querySelectorAll(".select").forEach((ele) => {
      ele.classList.remove("select");
    });
    e.target.closest("div").classList.add("select");
  } else {
      document.querySelectorAll(".select").forEach((ele) => {
      ele.classList.remove("select") });
  }
});





rename.addEventListener("click", (ev) => {
  ev.stopPropagation();
  if (!document.querySelector(".select", ".folder")) return;
  let input = document.createElement("input");
  let oldName = document.querySelector(".select").children[1].innerText
  input.value = oldName;
  document.querySelector(".select").replaceChild(input, document.querySelector(".select").children[1]);
  input.focus();
  input.addEventListener("blur", (eve) => {
    let newName = input.value;
    if (oldName === newName || !newName.trim()) {
      location.reload();
      return;
    }
    fetch(window.location.href, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldName: oldName, newName: newName }),
    })
      .then((res) => res.json())
      .then(() => {
            window.location.href=window.location.href
      });
  });
});   



 delet.addEventListener("click", (ev) => {
   ev.stopPropagation();
   if (!document.querySelector(".select", ".folder")) return;
   let delFolder = document.querySelector(".select").children[1].innerText

  console.log(delFolder);
   fetch(window.location.href, {
     method: "DELETE",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ delFolder: delFolder }),  
     }) .then((res) => res.json()).then(() => {
      window.location.href=window.location.href });
 });   





  scn[0].addEventListener("dblclick", (e) => {
     let i = e.target.closest("div").children[1].innerText;            
     window.location.href = window.location.origin + window.location.pathname + "/" + `${i}`;
  });





newFolder.addEventListener("click", (e) => {
  let div = document.createElement("div");
  div.classList.add(["folder", "select"]);
  let spn1 = document.createElement("span");
  spn1.classList.add("spn1");
  spn1.innerText = "📁";
  let input = document.createElement("input");
  input.classList.add("new");
  input.value = "";
  div.appendChild(spn1);
  div.appendChild(input);
  scn[0].appendChild(div);
  input.focus();
  input.addEventListener("blur", (ev) => {
    if (!input.value.trim()) {
       ev.target.closest("div").remove();
       return;
    }
    fetch(window.location.href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ NewFolder: ev.target.value }),
    }).then((res) =>{ window.location.href=window.location.href } );

   });
});



inp.addEventListener('change',(e)=>{

      fetch(window.location.href,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({'inpute':e.target.value})
      }).then((res)=>res.json()).then((res)=>{
        
        
if(res.data.length>0)
   { scn[0].innerText="";
    newFolder.disabled=true 
   for(let ele of res.data)
  {
  let div = document.createElement("div");
  div.classList.add("folder");
  let spn1 = document.createElement("span");
  spn1.classList.add("spn1");
  spn1.innerText = "📁";
  let spn2 = document.createElement("span");
  //spn2.classList.add("spn2");
  spn2.innerText=ele
  div.appendChild(spn1);
  div.appendChild(spn2);
  scn[0].appendChild(div);
 } }})   
 })       




newFile.addEventListener("click", (e) => {
  let div = document.createElement("div");
  div.classList.add(["folder", "select"]);
  let spn1 = document.createElement("span");
  spn1.classList.add("spn1");
  spn1.innerText = "📄";
  let input = document.createElement("input");
  input.classList.add("new");
  input.value = "text.txt";
  div.appendChild(spn1);
  div.appendChild(input);
  scn[0].appendChild(div);
  input.focus();
  input.addEventListener("blur", (ev) => {
    if (!input.value.trim()) {
       ev.target.closest("div").remove();
       return;
    }
    fetch(window.location.href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ NewFile: ev.target.value }),
    }).then((res) =>{ window.location.href=window.location.href } );

   });
});

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  
  const currentPath = window.location.pathname.slice(1);
  let uploadUrl = "/upload";
  let redirectPath = '/';
  
  if (currentPath) {
    uploadUrl = "/upload?path=" + encodeURIComponent(currentPath);
    redirectPath = '/' + currentPath;
  }

  fetch(uploadUrl, {
    method: "POST",
    body: formData
  }).then(() => {
    window.location.href = redirectPath;
  });
});
