import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  //Testing API key, don't use in production
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

export const callOpenAI = async (body) => {
  console.log(process.env.OPEN_AI_KEY);
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