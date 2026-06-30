import path from "path";
import fs from "fs";

function search(fname, rootPath, arr) {
    let dirContent = fs.readdirSync(rootPath);

    if (dirContent.length === 0) {
        return arr;
    }

    for (let f of dirContent) {
        const fullPath = path.join(rootPath, f);

        // Match substring (case-insensitive)
        if (f.toLowerCase().includes(fname.toLowerCase())) {
            arr.push(fullPath);
        }

        // Continue searching inside directories
        if (fs.statSync(fullPath).isDirectory()) {
            search(fname, fullPath, arr);
        }
    }

    return arr;
}

export default search;

















// import path from "path";
// import fs from "fs";


// //let rootPath="C:\\Users\\lenovo\\WebDev-Program\\FileManagers"
// //let arr=[]


// function search(fname, rootPath,arr) {

//   let dirContent = fs.readdirSync(rootPath);
//      // console.log(dirContent);
      
//     if(dirContent.length===0){
//           return arr
//     }
//   for (let f of dirContent) {
//     if (fname === f) {

//                 arr.push(path.join(rootPath, "/", fname));

//          }
//     else if(fs.statSync(path.join(rootPath, f)).isDirectory()) {
              
//             search(fname, path.join(rootPath, "/", f),arr);
                
//             }
//      }

//      return arr
// }

// export default search