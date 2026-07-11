export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_KEY // ✅ chave segura
        },
        body: JSON.stringify(req.body)
      }
    );

    const data = await resposta.json();
    res.status(200).json(data);

  } catch (erro) {
    res.status(500).json({ error: erro.message });
  }
}