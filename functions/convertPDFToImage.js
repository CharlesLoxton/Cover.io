import fs from "fs";
import { Poppler } from "node-poppler";

const convertPDFToImage = async (inputPath, outputPath) => {

    const poppler = new Poppler();

    const options = {
        firstPageToConvert: 1,
        lastPageToConvert: 1,
        pngFile: true,
    };

    // Convert the PDF to an image
    const res = await poppler.pdfToCairo(inputPath, outputPath, options);

    console.log(res);
  
}

export default convertPDFToImage;