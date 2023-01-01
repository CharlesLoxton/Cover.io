import fs from "fs";

const deleteFile = (path) => {
    fs.unlink(path, function(error) {
        if (error) {
          console.error(error);
        } else {
          console.log(`file was deleted successfully.`);
        }
    });
}

export default deleteFile;