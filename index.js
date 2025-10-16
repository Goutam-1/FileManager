import express from "express";
import fs from "fs";
import path from 'path'
import search from "./search.js";
import process from "process";



const app = express();


const rootPath =path.join(process.cwd(),'Root')

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");


app.post("/save-file",(req,res)=>{
        let {textarea,fpath}=req.body
        fs.writeFileSync(fpath,textarea,'utf8');
        console.log(req.body.fpath.split(rootPath));
        
        res.redirect(req.body.fpath.split(rootPath)[1])     
})

app.delete("/",(req,res)=>{
  let {delFolder} =req.body
  delFolder=path.join(rootPath,delFolder)
  fs.rmSync(delFolder,{recursive:true,force:true},(err)=>{
    if(err){
             res.status(500).json({massae:err.massage})
       }
     }) 
   res.json({massage:"ok...."})
})



app.delete("/*pathValue",(req,res)=>{
  
  let   {delFolder} =req.body
  let fullpath=""
  for(let ele of req.params.pathValue)
    { 
       fullpath=path.join(fullpath,ele)
    }

    delFolder=path.join(rootPath,fullpath,delFolder)
    console.log(delFolder);
  
  fs.rmSync(delFolder,{recursive:true,force:true},(err)=>{
    if(err){
      res.status(500).json({massae:err.massae})
    }
  })
   res.json({massage:"ok...."})
})


app.patch('/',(req,res)=>{     
    const {oldName,newName}=req.body
    let count = 2;
    let fullpath = path.join(rootPath,newName);
    while (fs.existsSync(fullpath)) {
      if(count>2){
        fullpath = fullpath.slice(0,fullpath.length - 3);}
        fullpath=`${fullpath}(${count})`
      count++;
    }
    fs.renameSync(path.join(rootPath,oldName),fullpath);
           res.json({massage:"ok"})           
})


app.patch('/*pathName',(req,res)=>{
let {oldName,newName}=req.body
    let pathvalue = "";
    for (const element of req.params.pathName) {
      pathvalue = path.join(pathvalue,element);
    }
    let fullpath = path.join(rootPath,pathvalue);
    oldName=path.join(fullpath,oldName)
    fullpath=path.join(rootPath,pathvalue,newName)
    let count = 1;  
    while (fs.existsSync(fullpath)) {
        if(count>2){
           fullpath = fullpath.slice(0,fullpath.length - 3);  
        }
      fullpath = `${fullpath}(${count})`;
      count++;
    }
    console.log(oldName,fullpath);
    
     fs.renameSync(oldName,fullpath);
       res.json({massage:"ok"})  

})



app.post("/", (req, res) => {
  if (req.body.inpute) {
    const arr = [];
    let data = search(req.body.inpute,rootPath,arr); 

     data =  data.map((ele)=>{
          return ele.split(path.join(rootPath+"/"))[1]
         })

      res.json({ data })
    }
    
  else if (req.body.NewFolder) {
    let count = 2;
    let fullpath = path.join(rootPath,req.body.NewFolder);
      while (fs.existsSync(fullpath)) {
        if(count>2)
            {
              fullpath = fullpath.slice(0,fullpath.length - 4);
            }
        fullpath=`${fullpath}(${count})`
        count++;   }

    fs.mkdirSync(fullpath);
    let data = fs.readdirSync(rootPath);
    res.render("./index.ejs", { data });
  }

  else if(req.body.NewFile){
      let count = 2;
      let fullpath = path.join(rootPath,req.body.NewFile);
      while (fs.existsSync(fullpath)) {
         if(count>2)
            {
              fullpath = fullpath.slice(0,fullpath.length - 4);
            }
        fullpath=`${fullpath}(${count})`
        count++;   }

    fs.writeFileSync(fullpath,"");
    let data = fs.readdirSync(rootPath);
    res.render("./index.ejs", { data });
  }  
});


app.post("/*pathName",(req, res) => {
   if (req.body.inpute) {
    let pathvalue = "";
    const arr = [];
    for (const element of req.params.pathName) {
      pathvalue = path.join(pathvalue,element)
    }
      let data = search(req.body.inpute,path.join(rootPath,pathvalue), arr);
      res.json({ data });
      } 
  else if (req.body.NewFolder) {
    let pathvalue = "";
    for (const element of req.params.pathName) {
      pathvalue =path.join(pathvalue, element);
    }
    let fullpath = path.join(rootPath, pathvalue,req.body.NewFolder);
    let count = 2;  
    while (fs.existsSync(fullpath)) {
        if(count>2){
           fullpath = fullpath.slice(0,fullpath.length - 4);  
        }
      fullpath = `${fullpath} (${count})`;
      count++;
    }
    fs.mkdirSync(fullpath);
    let data = fs.readdirSync(rootPath);
    res.render("./index.ejs", { data });
  }

  else if (req.body.NewFile) {
    let pathvalue = "";
    for (const element of req.params.pathName) {
      pathvalue =path.join(pathvalue, element);
    }
    let fullpath = path.join(rootPath, pathvalue,req.body.NewFile);
    let count = 2;  
    while (fs.existsSync(fullpath)) {
        if(count>2){
           fullpath = fullpath.slice(0,fullpath.length - 4);  
        }
      fullpath = `${fullpath} (${count})`;
      count++;
    }
    fs.writeFileSync(fullpath,"");
    let data = fs.readdirSync(rootPath);
    res.render("./index.ejs", { data });
  }


});


app.get("/", (req, res) => {
    let data = fs.readdirSync(rootPath);
    res.render("./index.ejs", { data });
});


app.get("/*pathName", (req, res) => {
  let pathvalue = "";
  for (const element of req.params.pathName) {
    pathvalue = path.join(pathvalue,element);
  }

   pathvalue=path.join(rootPath,pathvalue)
   
  if (fs.statSync(pathvalue).isFile())
      {  if(path.extname(req.params.pathName[req.params.pathName.length-1])==='.txt')
               { let data=fs.readFileSync(pathvalue,'utf8')
                 res.render("edit",{filename:req.params.pathName[req.params.pathName.length-1],data:data,path:pathvalue}) 
                }   
          else{
            res.sendFile(pathvalue)
          }
     }
      
  else {
       let data = fs.readdirSync(pathvalue);
       res.render("./index.ejs", { data });
   }
});




app.listen(3000, () => {
  console.log("Server is running on port 3000..........");
});
