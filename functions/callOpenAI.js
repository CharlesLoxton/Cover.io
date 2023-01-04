import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
});
const openai = new OpenAIApi(configuration);

export const callOpenAI = async (body) => {
    try{
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Write me a cover letter, this is my CV: ${body}`,
        max_tokens: 3000,
        temperature: 0,
      });

      return response.data.choices[0].text;
    }catch(err){
      console.log("Error with chatGPT " + err);
    }
}