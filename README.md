# 🤖 NexBot – AI Study Companion

A full-stack chatbot project built with **Python Flask** (backend) and **HTML/CSS/JS** (frontend).  
Works offline with a smart rule-based engine, and upgrades to full AI when you add an API key.

---

## 📁 Project Structure

```
chatbot-project/
├── app.py                  ← Flask backend (API + chatbot logic)
├── requirements.txt        ← Python dependencies
├── templates/
│   └── index.html          ← Chat UI (HTML)
└── static/
    ├── style.css           ← Dark theme styles
    └── script.js           ← Frontend logic (fetch, bubbles, etc.)
```

---

## 🚀 How to Run (Step-by-Step)

### Step 1 – Install Python
Make sure Python 3.9+ is installed:  
👉 https://www.python.org/downloads/

### Step 2 – Open the project in VS Code
1. Open **VS Code**
2. `File → Open Folder` → select `chatbot-project`
3. Open the **Terminal**: `` Ctrl+` `` (backtick)

### Step 3 – Create a virtual environment (recommended)
```bash
python -m venv venv
```
Activate it:
- **Windows**: `venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

### Step 4 – Install dependencies
```bash
pip install flask
```
*(For full AI mode, also run: `pip install anthropic`)*

### Step 5 – Run the server
```bash
python app.py
```
You should see:
```
🤖  NexBot is starting…
    Open your browser → http://127.0.0.1:5000
```

### Step 6 – Open your browser
Go to: **http://127.0.0.1:5000**  
Start chatting! 🎉

---

## 🧠 Two Modes

| Mode | How to enable | Description |
|------|--------------|-------------|
| **Rule-based** (default) | Just run the app | Smart keyword matching – works offline |
| **AI powered** | Set `ANTHROPIC_API_KEY` env variable | Uses Claude claude-sonnet-4-20250514 via Anthropic API |

### Enabling AI mode
**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY = "your-key-here"
python app.py
```
**Mac/Linux:**
```bash
export ANTHROPIC_API_KEY="your-key-here"
python app.py
```
Get a free API key at: https://console.anthropic.com

---

## 💬 What can NexBot answer?

| Topic | Examples |
|-------|---------|
| 🐍 Python | "Explain Python basics", "What is a list comprehension?" |
| 🌐 JavaScript | "JavaScript tips", "What is the DOM?" |
| 🔀 Git | "How do I use Git?", "Explain GitHub" |
| 🐛 Debugging | "How to debug my code?", "What causes errors?" |
| 📚 Study / Exams | "How to study better?", "Exam preparation tips" |
| 💡 Projects | "Give me project ideas", "How to build a web app?" |
| 💼 Career | "How to prepare for a tech interview?", "Resume tips" |
| 💪 Motivation | "I feel demotivated", "Help me stay focused" |

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI**: Anthropic Claude API (optional) with rule-based fallback
- **Fonts**: Syne + DM Sans (Google Fonts)
- **No frameworks** – beginner friendly!

---

## 📌 Tips for VS Code

- Install the **Python** extension by Microsoft
- Install **Prettier** for code formatting
- Use `Ctrl+Shift+P → Python: Select Interpreter` to pick your venv
- The **Thunder Client** extension lets you test the API endpoint directly

---

## 🏆 Competition Tips

1. Add your college name / logo to the sidebar header in `index.html`
2. Extend `RESPONSES` in `app.py` with domain-specific Q&A for your field
3. Deploy for free on **Render.com** or **Railway.app** for a live demo URL
4. Record a 60-second screen demo video for the presentation

---

*Built with ❤️ for college project competitions.*
