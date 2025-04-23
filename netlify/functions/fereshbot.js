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
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `User: ${message}\nBot:`,
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
    console.error("Mistral error:", error.message);
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
