export const runtime = "nodejs";


import axios from "axios";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), {
        status: 400,
      });
    }

    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      // "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
        "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    // console.log("HF STATUS:", response.status);

    if (response.status !== 200) {
      let text = "";
      try {
        text = Buffer.from(response.data).toString("utf8");
      } catch {}
      throw new Error(text || "HF error");
    }

    const base64 = Buffer.from(response.data).toString("base64");

    return new Response(JSON.stringify({ image: `data:image/png;base64,${base64}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("HF ROUTE ERROR:", e.message);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
