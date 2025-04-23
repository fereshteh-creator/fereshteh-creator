// /netlify/functions/fereshbot.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const message = body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are FereshBot, an assistant that knows everything about Fereshteh: her projects, skills, and contact info.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices[0].message.content }),
  };
};
