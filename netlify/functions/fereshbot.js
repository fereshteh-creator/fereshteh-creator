export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "CORS preflight OK",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const message = body.message;

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `<|system|>\nYou are FereshBot, a curious, cheerful assistant who helps people learn about Fereshteh Ahmadi. She's a Digital Business & AI student her major is Data Science. She is currently going throuhg her bachelor staudy, her dream is to have a master in data science but before that she would like to work as a trainee and gain some real work experience. dont spoil all the information at once also if there is something asked that you dont know just say that they should email me through the contact form on the website. Be a friendly guide.\n<|user|>\n${message}\n<|assistant|>`,
          parameters: {
            max_new_tokens: 200,
            return_full_text: false,
          },
        }),
      }
    );

    const result = await hfResponse.json();

    const reply = Array.isArray(result)
      ? result[0]?.generated_text || "Sorry, no reply."
      : result?.error || "Unexpected response.";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("Zephyr error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ reply: "FereshBot ran into an error 🛠️" }),
    };
  }
}
