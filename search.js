import path from "path";
import fs from "fs";


//let rootPath="C:\\Users\\lenovo\\WebDev-Program\\FileManagers"
//let arr=[]


function search(fname, rootPath,arr) {

  let dirContent = fs.readdirSync(rootPath);
     // console.log(dirContent);
      
    if(dirContent.length===0){
          return arr
    }
  for (let f of dirContent) {
    if (fname === f) {

                arr.push(path.join(rootPath, "/", fname));

         }
    else if(fs.statSync(path.join(rootPath, f)).isDirectory()) {
              
            search(fname, path.join(rootPath, "/", f),arr);
                
            }
     }

     return arr
}

export default search