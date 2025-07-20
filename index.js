const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const axios = require("axios");

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.post("/npc", async (req, res) => {
  const { systemPrompt, userInput } = req.body;
  console.log("BODY RECIBIDO:", req.body);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userInput }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    console.log("RESPUESTA OPENAI:", response.data);

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Error al contactar con la IA");
  }
});

// Esto es lo que mantiene vivo el servidor en Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
