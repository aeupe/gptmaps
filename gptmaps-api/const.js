module.exports = {
    PORT: parseInt(process.env.PORT || 8080),
    OPENAI_PROMPT_PREFIX: process.env.OPENAI_PROMPT_PREFIX || '',
    OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || 512)
}