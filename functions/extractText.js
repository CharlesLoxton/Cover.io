import { ocrSpace } from "ocr-space-api-wrapper";

const extractText = async (imagePath) => {
    // Using your personal API key + local file

    try{
        "free one has 500 calls per day; 25k per month"
        const res = await ocrSpace(imagePath, { apiKey: process.env.SPACE_OCR_KEY });

        return res; 
    }
    catch(err){
        console.log("Error trying to extract with API " + err);
    }
}

export default extractText;