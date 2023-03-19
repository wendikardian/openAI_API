// 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

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


const configuration = new Configuration({
  organization: "org-X7OTqitgE201Hs1EX7NTzYRf",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// add body parser and cors to express

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;
  console.log(currentModel)
  const response = await openai.createCompletion({
      "model": `${currentModel}`,
      "prompt": `${message}`,
      "max_tokens": 1000,
      "temperature": 0.5,

    })



//   console.log(response.data.choices[0].text);
  res.json({
    message: response.data.choices[0].text,
  });
});
app.get('/models', async(req, res) => {
    const response = await openai.listEngines();
    // console.log(response.data.data)
    res.json({
        models : response.data.data
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
