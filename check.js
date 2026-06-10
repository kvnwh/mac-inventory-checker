const axios = require("axios");
const nodemailer = require("nodemailer");

const MINI =  "https://www.apple.com/shop/refurbished/mac/mac-mini"
const MBP = "https://www.apple.com/shop/refurbished/mac/macbook-pro"
const TARGET = MINI

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function sendInventoryEmail() {
  const to = getRequiredEnv("EMAIL_TO");
  const from = process.env.EMAIL_FROM || to;

  const transporter = nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Mac mini refurb inventory is available",
    text: `Apple refurb Mac mini inventory appears to be available:\n\n${MINI}`,
  });

  console.log(`Inventory email sent to ${to}`);
}

async function checkMacMini() {
  try {
    const response = await axios.get(
      TARGET,
      {
        maxRedirects: 0,
        validateStatus: null
      }
    );

    console.log("Status:", response.status);

    if (response.status === 301 || response.status === 302) {
      console.log("No inventory found");
      console.log("Redirects to:", response.headers.location);
      return false;
    }

    console.log("Inventory available!");
    return true;
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
    return false;
  }
}

async function main() {
  const hasInventory = await checkMacMini();
  if (hasInventory) {
    await sendInventoryEmail();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
