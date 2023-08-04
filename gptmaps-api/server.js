const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    morgan = require('morgan'),
    app = express(),
    { PORT, OPENAI_MAX_TOKENS, OPENAI_PROMPT_PREFIX } = require('./const'),
    { Configuration, OpenAIApi } = require("openai")
    
app.use(cors())
app.options('*', cors());
app.use(morgan('combined'))
app.use(bodyParser.json())

app.post('/query', async (req, res) => {
    const prompt = req.body.query
    const openai = new OpenAIApi(new Configuration({
        apiKey: req.headers['x-openai-api-key'] || ''
    }))
    let content = ""
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4-0613",
            messages: [
                {role: "user", content: OPENAI_PROMPT_PREFIX}, 
                {role: "user", content: prompt}
            ],
            max_tokens: OPENAI_MAX_TOKENS
        })    
        console.log(completion.data.choices[0])
        content = completion.data.choices[0].message.content
        const arr = JSON.parse(content)
        res.send({response: arr})
    } catch (err) {
        console.error(err?.message)
        res.status(400).send({error: content})
    }
})

app.use((err, req, res, next) => {
    console.error(err)
    res.sendStatus(500)
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})