
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Limit requests to 10 per minute per client IP.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many AI requests. Please wait one minute and try again.",
    message: "Too many AI requests. Please wait one minute and try again.",
  },
});

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS."));
    },
  })
);

app.use(express.json({ limit: "20kb" }));

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CodeSathi AI Backend!",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CodeSathi AI server is running successfully.",
    status: "healthy",
  });
});

// AI question route
app.post("/api/ask", aiLimiter, async (req, res) => {
  const { question } = req.body ?? {};

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      success: false,
      error: "Please enter a coding question.",
      message: "Please enter a coding question.",
    });
  }

  const prompt = question.trim();

  if (prompt.length > 5000) {
    return res.status(413).json({
      success: false,
      error: "Your question is too long. Please keep it under 5000 characters.",
      message: "Your question is too long. Please keep it under 5000 characters.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "PASTE_YOUR_API_KEY_HERE") {
    return res.status(500).json({
      success: false,
      error: "Gemini API key is not configured in server/.env.",
      message: "Gemini API key is not configured in server/.env.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    let response;

    // Retry temporary service errors, but do not retry quota errors.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: `You are CodeSathi AI, a friendly programming tutor.
Explain concepts clearly using simple language and examples.
When useful, include step-by-step explanations and code.
Clearly identify the programming language for code examples.
Do not claim code has been executed unless it actually has.

Student's question:
${prompt}`,
        });

        break;
      } catch (error) {
        const errorText = [
          error?.status,
          error?.statusCode,
          error?.code,
          error?.message,
        ]
          .filter(Boolean)
          .join(" ");

        const numericStatus = [
          error?.status,
          error?.statusCode,
          error?.code,
        ]
          .map(Number)
          .find(Number.isFinite);

        const isTemporaryError =
          numericStatus === 503 ||
          numericStatus === 504 ||
          /UNAVAILABLE|DEADLINE_EXCEEDED/i.test(errorText);

        const isLastAttempt = attempt === 2;

        if (!isTemporaryError || isLastAttempt) {
          throw error;
        }

        const waitMs = 1000 * 2 ** attempt;

        console.warn(
          `Gemini temporarily unavailable. Retrying in ${
            waitMs / 1000
          } second(s).`
        );

        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    const answer = response?.text;

    if (typeof answer !== "string" || !answer.trim()) {
      return res.status(502).json({
        success: false,
        error: "The AI returned an empty response. Please try again.",
        message: "The AI returned an empty response. Please try again.",
      });
    }

    return res.json({
      success: true,
      answer: answer.trim(),
    });
  } catch (error) {
    // Keep diagnostic information on the backend only.
    const errorText = [
      error?.status,
      error?.statusCode,
      error?.code,
      error?.message,
    ]
      .filter(Boolean)
      .join(" ");

    const numericStatus = [
      error?.status,
      error?.statusCode,
      error?.code,
    ]
      .map(Number)
      .find(Number.isFinite);

    console.error("Gemini request failed:", {
      status: Number.isFinite(numericStatus)
        ? numericStatus
        : "unknown",
      code: String(error?.code ?? error?.status ?? "unknown"),
      message: String(error?.message ?? "Unknown error").slice(0, 500),
    });

    const isQuotaError =
      numericStatus === 429 ||
      /RESOURCE_EXHAUSTED|TOO_MANY_REQUESTS|quota|rate.?limit/i.test(
        errorText
      );

    if (isQuotaError) {
      return res.status(429).json({
        success: false,
        error:
          "Gemini API quota or rate limit reached. Check your Google AI Studio usage and limits, then try again later.",
        message:
          "Gemini API quota or rate limit reached. Check your Google AI Studio usage and limits, then try again later.",
      });
    }

    const isTemporaryError =
      numericStatus === 503 ||
      numericStatus === 504 ||
      /UNAVAILABLE|DEADLINE_EXCEEDED/i.test(errorText);

    if (isTemporaryError) {
      return res.status(503).json({
        success: false,
        error: "The AI service is temporarily busy. Please try again shortly.",
        message: "The AI service is temporarily busy. Please try again shortly.",
      });
    }

    return res.status(502).json({
      success: false,
      error: "The AI request failed. Check the backend terminal for details.",
      message: "The AI request failed. Check the backend terminal for details.",
    });
  }
});

// Handle malformed JSON and request-size errors.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request body is too large.",
      message: "Request body is too large.",
    });
  }

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON request body.",
      message: "Invalid JSON request body.",
    });
  }

  if (error?.message === "Origin not allowed by CORS.") {
    return res.status(403).json({
      success: false,
      error: "This website origin is not allowed to access the API.",
      message: "This website origin is not allowed to access the API.",
    });
  }

  console.error("Unhandled server error:", error?.message);

  return res.status(500).json({
    success: false,
    error: "An unexpected server error occurred.",
    message: "An unexpected server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`CodeSathi AI backend running at http://localhost:${PORT}`);
});
