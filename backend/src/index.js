require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { convert } = require("html-to-text");
const { connectDB } = require("./database"); // Import database connection function
const { webDataModel } = require("./Models/WebsiteData"); // Import data model
const PORT = process.env.PORT || 3000; // Set the server port
const HUGGINFACE_KEY = process.env.HUGGINFACEKEY; // API key for Hugginface model
const AI_MODEL_URL = process.env.AI_MODEL; // URL for the AI model

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Handle AI chat requests
app.post("/ai-chat", async (req, res) => {
  let htmlData = "";
  const dbResponse = await webDataModel.find({
    url: req.body.url,
  });

  // If data not found in the database, fetch from the website
  if (dbResponse.length === 0) {
    try {
      const webResponse = await axios.get(`${req.body.url}`);
      htmlData = convert(webResponse.data); // Convert HTML to plain text
      await webDataModel.create({
        url: req.body.url,
        name: req.body.name,
        textData: htmlData,
      });
      console.log("Hit refetch");
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Something went wrong!",
      });
    }
  } else {
    htmlData = dbResponse[0].textData; // Use data from the database
  }
  const question = req.body.question;
  const prompt = `You are a helpful and honest assistant. Please analyze the given data and respond concisely and truthfully. Here is Website data: {${htmlData}}, Question: ${question} Answer:`;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${HUGGINFACE_KEY}`,
        "Content-Type": "application/json",
      },
      method: "post",
    };

    // Make a request to the AI model
    const response = await axios.post(
      AI_MODEL_URL,
      JSON.stringify({
        inputs: prompt,
      }),
      config
    );

    const queryResult = await response.data;
    const result = queryResult[0].generated_text.split("Answer:")[1].trim();
    res.send(result); // Send the AI-generated answer
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  connectDB(); // Connect to the database
  console.log("Server started at", PORT);
});
