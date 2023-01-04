import pdf2pic from "pdf2pic";

const convertPDFToImage = async (inputPath, outputName) => {

    const options = {
        density: 100,
        savename: outputName,
        savedir: "/tmp",
        format: "png"
      };
      
      pdf2pic.convertPdf2Pic(inputPath, options)
      .then((resolve) => {
            console.log("image converted successfully");
      }).catch((error) => {
            console.log("Error during conversion: " + error);
      });
  
}

export default convertPDFToImage;