API_KEY; 

const formulario = document.querySelector("form");
const recomendacaoTexto = document.querySelector("#recomendacao p");
const conscientizacaoTexto = document.querySelector("#conscientizacao p");
const avaliacaoTrocaTexto = document.querySelector("#avaliacao-troca p");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const celularAtual = document.getElementById("celularAtual").value;
  const tempoUso = document.getElementById("tempoUso").value;
  const motivoTroca = document.getElementById("motivoTroca").value;
  const orcamento = document.getElementById("orcamento").value;
  const recondicionado = document.getElementById("recondicionado").value;
  const compraImpulso = document.getElementById("compraImpulso").value;
  const observacoes = document.getElementById("observacoes").value.trim();

  const prioridades = Array.from(
    document.querySelectorAll('input[name="prioridades"]:checked')
  ).map((item) => item.value);

  recomendacaoTexto.textContent = "Analisando seu perfil...";
  conscientizacaoTexto.textContent = "Gerando orientação consciente...";
  avaliacaoTrocaTexto.textContent = "Verificando se a troca é realmente necessária...";

  const prompt = `
Você é a IA do MatchPhone, um aplicativo que recomenda smartphones de forma consciente e reeduca o usuário para não comprar por status, aparência ou consumismo.

Analise os dados abaixo e responda em português do Brasil, de forma clara, objetiva e humana.

Dados do usuário:
- Celular atual funciona bem: ${celularAtual || "não informado"}
- Tempo de uso do celular atual: ${tempoUso || "não informado"}
- Motivo da troca: ${motivoTroca || "não informado"}
- Prioridades: ${prioridades.length ? prioridades.join(", ") : "nenhuma informada"}
- Orçamento máximo: ${orcamento || "não informado"}
- Aceita recondicionado/usado: ${recondicionado || "não informado"}
- Acha que pode ser impulso/status/tendência: ${compraImpulso || "não informado"}
- Observações: ${observacoes || "nenhuma"}

Quero que você gere exatamente um JSON com estas 3 chaves:
{
  "recomendacao": "texto",
  "conscientizacao": "texto",
  "avaliacao": "texto"
}

Regras:
- "recomendacao": diga qual perfil de smartphone faz mais sentido, sem citar marcas específicas.
- "conscientizacao": dê uma mensagem educativa sobre consumo consciente.
- "avaliacao": diga se a troca parece necessária ou não neste momento, com justificativa.
- Não escreva nada fora do JSON.
`;

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                recomendacao: { type: "STRING" },
                conscientizacao: { type: "STRING" },
                avaliacao: { type: "STRING" }
              },
              required: ["recomendacao", "conscientizacao", "avaliacao"]
            }
          }
        })
      }
    );

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      throw new Error(erroTexto);
    }

    const resultado = await resposta.json();
    const textoGerado = resultado.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoGerado) {
      throw new Error("A resposta da API veio vazia.");
    }

    const dados = JSON.parse(textoGerado);

    recomendacaoTexto.textContent = dados.recomendacao || "Não foi possível gerar a recomendação.";
    conscientizacaoTexto.textContent = dados.conscientizacao || "Não foi possível gerar a conscientização.";
    avaliacaoTrocaTexto.textContent = dados.avaliacao || "Não foi possível gerar a avaliação.";
  } catch (erro) {
    recomendacaoTexto.textContent = "Erro ao analisar o perfil.";
    conscientizacaoTexto.textContent = "Verifique sua chave da API e sua conexão com a internet.";
    avaliacaoTrocaTexto.textContent = "Detalhes: " + erro.message;
  }
});