require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

//CONFIG MAILGUN
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Sam",
  key: process.env.MAILGUN_API_KEY,
});
app.post("/form", async (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.body;

    //Create a messagedata Obj to keep email infos
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "samuel.halera@gmail.com",
      subject: subject,
      text: message,
    };

    //Send infos to MAILGUN in order to send us an email
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );
    console.log(req.body);
    res.status(200).json(firstname);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
app.get("/", (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome !!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({
    message: "Page does not exist!",
  });
});
app.listen(3000, () => {
  console.log("Server started :-)");
});
