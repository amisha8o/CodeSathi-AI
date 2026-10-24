import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, "");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      alert("Code copy nahi ho paya. Code select karke manually copy karein.");
    }
  }

  return (
    <div className="code-output">
      <div className="code-output-header">
        <span>{language || "code"}</span>
        <button type="button" onClick={copyCode}>
          {copied ? "Copied ✓" : "Copy code"}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || "text"}
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "18px",
          background: "#111827",
          fontSize: "13px",
          lineHeight: 1.7,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function MarkdownCode({ className, children, ...props }) {
  const match = /language-([\w+#.-]+)/.exec(className || "");

  if (match) {
    return <CodeBlock language={match[1]}>{children}</CodeBlock>;
  }

  return (
    <code className={`inline-code ${className || ""}`} {...props}>
      {children}
    </code>
  );
}
 function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const [chatHistory, setChatHistory] = useState(() => {
  try {
    const savedChats = localStorage.getItem("codesathi_chat_history");
    return savedChats ? JSON.parse(savedChats) : [];
  } catch {
    return [];
  }
});

const [activeChatId, setActiveChatId] = useState(null);
useEffect(() => {
  try {
    localStorage.setItem(
      "codesathi_chat_history",
      JSON.stringify(chatHistory)
    );
  } catch (error) {
    console.error("Unable to save chat history:", error);
  }
}, [chatHistory]);


  const requestInProgress = useRef(false);

  const askQuestion = async (prompt) => {
  const trimmedPrompt = prompt.trim();

  if (requestInProgress.current) return;

  if (!trimmedPrompt) {
    setError("Please enter a coding question before submitting.");
    setAnswer("");
    return;
  }

  requestInProgress.current = true;
  setQuestion(trimmedPrompt);
  setLoading(true);
  setError("");
  setAnswer("");

  try {
    let response;

    try {
      response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedPrompt }),
      });
    } catch {
      throw new Error(
        "Unable to connect to CodeSathi AI. Please check whether the backend is running."
      );
    }

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an invalid response. Please try again."
      );
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          data.error ||
            "Gemini API quota or rate limit reached. Please try again later."
        );
      }

      if (response.status === 503 || response.status === 504) {
        throw new Error(
          data.error ||
            "The AI service is temporarily busy. Please try again shortly."
        );
      }

      if (response.status === 400) {
        throw new Error(
          data.error || "Please enter a valid coding question."
        );
      }

      if (response.status >= 500) {
        throw new Error(
          data.error ||
            "The CodeSathi AI server encountered an error. Please try again."
        );
      }

      throw new Error(
        data.error || "Unable to get an AI response."
      );
    }

    const result =
      data.answer || data.response || data.text || data.result;

    if (typeof result !== "string" || !result.trim()) {
      throw new Error(
        "The AI returned an empty response. Please try again."
      );
    }

    setAnswer(result);

    const chatId = Date.now();
    setActiveChatId(chatId);

    setChatHistory((previous) => [
      {
        id: chatId,
        question: trimmedPrompt,
        answer: result,
        createdAt: new Date().toLocaleString(),
      },
      ...previous,
    ]);
  } catch (err) {
    setError(
      err.message || "Something went wrong. Please try again."
    );
  } finally {
    requestInProgress.current = false;
    setLoading(false);
  }
};


const handleSubmit = async (event) => {
  event.preventDefault();

  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    setError("Please enter a coding question before submitting.");
    setAnswer("");
    return;
  }

  setError("");
  await askQuestion(trimmedQuestion);
};


  function handleSuggestion(text) {
    setQuestion(text);
    setError("");

    document.getElementById("ask-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

 const handleNewChat = () => {
  setQuestion("");
  setAnswer("");
  setError("");
  setActiveChatId(null);
};

const handleDeleteChat = (chatId) => {
  setChatHistory((previous) =>
    previous.filter((chat) => chat.id !== chatId)
  );

  if (activeChatId === chatId) {
    setQuestion("");
    setAnswer("");
    setError("");
    setActiveChatId(null);
  }
};

const handleClearHistory = () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete all chat history? This cannot be undone."
  );

  if (!confirmed) return;

  setChatHistory([]);
  setQuestion("");
  setAnswer("");
  setError("");
  setActiveChatId(null);
};



  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="CodeSathi AI home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            CodeSathi<span className="brand-ai"> AI</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#ask">AI Assistant</a>
        </nav>

        <a className="nav-cta" href="#ask">
          Start Coding <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero section-container" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              YOUR AI-POWERED CODING COMPANION
            </div>

            <h1>
              Code Smarter.
              <br />
              Learn <span className="gradient-text">Faster.</span>
              <br />
              Build Better.
            </h1>

            <p className="hero-description">
              Meet CodeSathi AI — your coding companion for programming
              concepts, debugging help, code examples and interview
              preparation. Learn step by step, one question at a time.
            </p>

            <div className="hero-actions">
              <a href="#ask" className="primary-button">
                Ask CodeSathi <span aria-hidden="true">→</span>
              </a>
              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="hero-points">
              <span>
                <span className="check-mark">✓</span> Programming help
              </span>
              <span>
                <span className="check-mark">✓</span> Simple explanations
              </span>
              <span>
                <span className="check-mark">✓</span> Code examples
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glow glow-one" />
            <div className="glow glow-two" />

            <div className="editor-window">
              <div className="editor-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="editor-filename">HelloWorld.java</span>
                <span className="editor-language">JAVA</span>
              </div>

              <div className="editor-content">
                <div className="code-line">
                  <span className="line-number">1</span>
                  <span>
                    <span className="syntax-purple">public class</span>{" "}
                    <span className="syntax-yellow">HelloWorld</span> {"{"}
                  </span>
                </div>

                <div className="code-line">
                  <span className="line-number">2</span>
                  <span className="indent">
                    <span className="syntax-purple">public static void</span>{" "}
                    <span className="syntax-blue">main</span>
                    <span>(String[] args) {"{"}</span>
                  </span>
                </div>

                <div className="code-line">
                  <span className="line-number">3</span>
                  <span className="indent-more">
                    <span className="syntax-blue">System.out.println</span>
                    <span>(</span>
                    <span className="syntax-green">
                      "Hello, Developer!"
                    </span>
                    <span>);</span>
                  </span>
                </div>

                <div className="code-line">
                  <span className="line-number">4</span>
                  <span className="indent">{"}"}</span>
                </div>

                <div className="code-line">
                  <span className="line-number">5</span>
                  <span>{"}"}</span>
                </div>
              </div>

              <div className="editor-footer">
                <span>
                  <span className="status-dot" /> Ready to code
                </span>
                <span>UTF-8</span>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">✦</span>
              <div>
                <strong>AI-Powered</strong>
                <small>Smart explanations</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-icon purple-icon">{"</>"}</span>
              <div>
                <strong>Learn by coding</strong>
                <small>Examples made simple</small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-strip section-container">
          <div className="stat-item">
            <strong>01</strong>
            <span>Your coding companion</span>
          </div>
          <div className="stat-item">
            <strong>AI</strong>
            <span>Intelligent assistance</span>
          </div>
          <div className="stat-item">
            <strong>24/7</strong>
            <span>Ask whenever you learn</span>
          </div>
          <div className="stat-item">
            <strong>{"</>"}</strong>
            <span>Learn with code examples</span>
          </div>
        </section>

        <section className="features-section section-container" id="features">
          <div className="section-heading">
            <div className="eyebrow centered-eyebrow">WHAT YOU CAN DO</div>
            <h2>
              Everything you need to
              <br />
              <span className="gradient-text">level up your coding.</span>
            </h2>
            <p>
              From your first programming question to interview preparation,
              get help that makes learning easier.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon icon-blue">{"</>"}</div>
              <h3>Code Generation</h3>
              <p>
                Generate code examples and learn how programs work with
                step-by-step explanations.
              </p>
              <button
                className="text-link"
                onClick={() =>
                  handleSuggestion(
                    "Write a Java program to check whether a number is prime and explain each line."
                  )
                }
              >
                Try an example <span>→</span>
              </button>
            </article>

            <article className="feature-card">
              <div className="feature-icon icon-purple">✧</div>
              <h3>Concept Explanations</h3>
              <p>
                Understand programming topics in simple language with
                examples, analogies and clear steps.
              </p>
              <button
                className="text-link"
                onClick={() =>
                  handleSuggestion(
                    "Explain loops in Java with simple examples for a beginner."
                  )
                }
              >
                Learn a concept <span>→</span>
              </button>
            </article>

            <article className="feature-card">
              <div className="feature-icon icon-green">⌘</div>
              <h3>Debugging Support</h3>
              <p>
                Share an error or code snippet and ask for help understanding
                possible problems and fixes.
              </p>
              <button
                className="text-link"
                onClick={() =>
                  handleSuggestion(
                    "Explain how to debug a Java NullPointerException with an example."
                  )
                }
              >
                Fix an error <span>→</span>
              </button>
            </article>

            <article className="feature-card">
              <div className="feature-icon icon-orange">◎</div>
              <h3>Interview Preparation</h3>
              <p>
                Practise Java, DSA, OOP, computer science fundamentals and
                common technical interview questions.
              </p>
              <button
                className="text-link"
                onClick={() =>
                  handleSuggestion(
                    "Give me 5 common Java interview questions with concise answers and examples."
                  )
                }
              >
                Practise now <span>→</span>
              </button>
            </article>
          </div>
        </section>

        <section className="assistant-section" id="ask">
          <div className="assistant-container">
            <div className="section-heading">
              <div className="eyebrow centered-eyebrow">
                <span className="status-dot" />
                YOUR PERSONAL AI ASSISTANT
              </div>
              <h2>
                What are we <span className="gradient-text">coding today?</span>
              </h2>
              <p>
                Ask a question, explore a concept or get a code example.
                CodeSathi AI is ready to help.
              </p>
            </div>

            <div className="chat-panel">
              <div className="chat-panel-header">
                <div className="assistant-avatar">{"</>"}</div>
                <div className="assistant-heading">
                  <strong>CodeSathi AI</strong>
                  <span>
                    <span className="status-dot" /> Ready to assist
                  </span>
                </div>
                <span className="powered-label">AI ASSISTANT</span>
              </div>

                <div className="chat-actions">
  <button
    type="button"
    onClick={handleNewChat}
    disabled={loading}
  >
    + New Chat
  </button>
</div>

              <div className="chat-welcome">
                <div className="welcome-symbol">✦</div>
                <h3>Hi, developer! 👋</h3>
                <p>
                  What would you like to learn today? Ask me about code,
                  programming concepts or interview questions.
                </p>
              </div>

              <div className="suggestion-list">

<button
  type="button"
  onClick={() =>
    askQuestion("Explain OOP concepts in Java with examples.")
  }
  disabled={loading}
>
  <span>◈</span> Explain OOP in Java
  <span className="suggestion-arrow">↗</span>
</button>

<button
  type="button"
  onClick={() =>
    askQuestion(
      "Write a Java program to reverse a string and explain the logic."
    )
  }
  disabled={loading}
>
  <span>⌘</span> Write a Java program
  <span className="suggestion-arrow">↗</span>
</button>

<button
  type="button"
  onClick={() =>
    askQuestion(
      "Explain binary search with an example and Java code."
    )
  }
  disabled={loading}
>
  <span>◉</span> Learn a DSA pattern
  <span className="suggestion-arrow">↗</span>
</button>

              </div>
               <section className="chat-history">
  <div className="history-header">
    <h3>Chat History</h3>

    {chatHistory.length > 0 && (
      <button
        type="button"
        className="clear-history-button"
        onClick={handleClearHistory}
        disabled={loading}
      >
        Clear All
      </button>
    )}
  </div>

  {chatHistory.length === 0 ? (
    <p>Your previous conversations will appear here.</p>
  ) : (
    <div className="history-list">
      {chatHistory.map((chat) => (
        <div
          key={chat.id}
          className={`history-item ${
            activeChatId === chat.id ? "active-chat" : ""
          }`}
        >
          <button
            type="button"
            className="history-chat-button"
            onClick={() => {
              setQuestion(chat.question);
              setAnswer(chat.answer);
              setActiveChatId(chat.id);
              setError("");
            }}
          >
            <span>{chat.question}</span>
            <small>{chat.createdAt}</small>
          </button>

          <button
            type="button"
            className="delete-chat-button"
            onClick={() => handleDeleteChat(chat.id)}
            disabled={loading}
            aria-label={`Delete chat: ${chat.question}`}
            title="Delete this chat"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )}
</section>



              <form id="ask-form" className="question-form" onSubmit={handleSubmit}>
                <label htmlFor="question-input">Your question</label>
                <textarea
                  id="question-input"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="e.g. Explain recursion in Java with a simple example..."
                  rows={4}
                  disabled={loading}
                />

                <div className="form-bottom">
                  <span>Be curious. Keep learning. Keep building.</span>
                  <button
                    className="primary-button submit-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Thinking..." : "Ask CodeSathi"}
                    {!loading && <span aria-hidden="true"> →</span>}
                  </button>
                </div>
              </form>

              {loading && (
                <div className="loading-box" role="status">
                  <span className="loading-spinner" />
                  <div>
                    <strong>CodeSathi is thinking...</strong>
                    <p>Preparing an answer for your question.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-box" role="alert">
                  <strong>Something went wrong</strong>
                  <p>{error}</p>
                  <small>
                    Confirm that the backend is running at localhost:5000.
                  </small>
                </div>
              )}

              {answer && (
                <section className="answer-box" aria-live="polite">
                  <div className="answer-title">
                    <div>
                      <span className="answer-sparkle">✦</span>
                      <strong>CodeSathi&apos;s Response</strong>
                    </div>
                    <span className="answer-tag">AI GENERATED</span>
                  </div>

                  <div className="markdown-answer">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: MarkdownCode,
                        pre({ children }) {
                          return <>{children}</>;
                        },
                      }}
                    >
                      {answer}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>

            <p className="assistant-note">
              <span>✦</span> AI responses can contain mistakes. Verify important
              code before using it in production.
            </p>
          </div>
        </section>

        <section className="closing-section section-container">
          <div className="closing-card">
            <div>
              <div className="eyebrow">YOUR NEXT STEP STARTS HERE</div>
              <h2>
                Have a question?
                <br />
                Let&apos;s solve it together.
              </h2>
              <p>
                Turn confusion into understanding, one line of code at a time.
              </p>
            </div>
            <a href="#ask" className="primary-button">
              Ask your first question <span>→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">&lt;/&gt;</span>
          <span>
            CodeSathi<span className="brand-ai"> AI</span>
          </span>
        </a>
        <p>Made for curious minds and future developers.</p>
        <a href="#home" className="back-to-top">
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}

export default App;