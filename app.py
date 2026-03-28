import random
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

GROQ_API_KEY = "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"

RESPONSES = {
    "greet": {
        "patterns": ["hello", "hi", "hey", "namaste", "kaise ho", "how are you"],
        "responses": ["Hey! Main NexBot AI hoon. bittu boss ka prasnal ai assistant kya help karu !", "Namaste! mai bittu boss ka prasnal AI assistant  Kya help kar sakta hoon?"]
    },
    "bot_name": {
        "patterns": ["what is your name", "tumhara naam kya ", "tum kon ho", "who are you", "your name"],
        "responses": [
            "Main NexBot AI hoon, Bittu boss ka banaya hua AI!"
            "NexBot, Bittu boss ka AI assistant hoon!"
            ]
    },
    "identity": {
        "patterns": ["who made you", "tumhe kisne banaya", "who is your creator", "made by"],
        "responses": ["Mujhe Bittu boss ne banaya hai!", "My creator is Bittu!"]
    },
    "about_bittu": {
        "patterns": ["who is bittu", "bittu kon hai", "what does bittu do"],
        "responses": ["Bittu boss ek talented young developer hain jinhone NexBot banaya!"]
    },
    "python": {
        "patterns": ["python", "python basics", "learn python"],
        "responses": ["Python beginners ke liye best hai! Variables, loops, functions seekho!"]
    },
    "javascript": {
        "patterns": ["javascript", "js", "learn javascript"],
        "responses": ["JavaScript web ka language hai! DOM, events, fetch API seekho!"]
    },
    "exam": {
        "patterns": ["exam", "study", "padhai", "marks", "result"],
        "responses": ["Pomodoro technique try karo! 25 min study, 5 min break!"]
    },
    "motivation": {
        "patterns": ["motivation", "tired", "thak gaya", "stressed", "give up"],
        "responses": ["Every expert was once a beginner. Keep going!", "Tum kar sakte ho!"]
    },
    "joke": {
        "patterns": ["joke", "funny", "hasao"],
        "responses": ["Why do programmers prefer dark mode? Because light attracts bugs!"]
    },
    "thanks": {
        "patterns": ["thanks", "thank you", "shukriya", "bahut achha"],
        "responses": ["You're welcome! Koi bhi sawaal ho poochh sakte ho!"]
    },
    "bye": {
        "patterns": ["bye", "goodbye", "alvida"],
        "responses": ["bye! All the best!"]
    },
}


def rule_based_response(message):
    msg = message.lower()
    for category, data in RESPONSES.items():
        for pattern in data["patterns"]:
            if pattern in msg:
                return random.choice(data["responses"]), True
    return None, False


def ai_response(message):
    try:
        GROQ_API_KEY = "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"
        url = "https://api.groq.com/openai/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": "You are NexBot, a friendly AI assistant made by Bittu. Rules: 1) If user writes in English, reply in English. 2) If user writes in Hindi, reply in Hindi. 3) If user asks to explain in English, always reply in English. 4) if user write in Hinglishi, reply in Hinglishi. 5) Keep answers short and helpful. 6) Use emojis sometimes. 7) Always understand context of previous messages."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "max_tokens": 500
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        data = response.json()
        
        if "choices" in data:
            return data["choices"][0]["message"]["content"]
        else:
            return f"Error: {data.get('error', {}).get('message', 'Unknown error')}"
            
    except Exception as e:
        return f"Error: {str(e)}"


def get_response(message, history):
    reply, found = rule_based_response(message)
    if found:
        return reply
    return ai_response(message)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        user_message = data.get("message", "").strip()
        history = data.get("history", [])
        if not user_message:
            return jsonify({"error": "Empty message", "status": "error"}), 400
        bot_reply = get_response(user_message, history)
        return jsonify({"response": bot_reply, "status": "ok"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500


@app.route("/api/status")
def status():
    return jsonify({"status": "running", "mode": "AI Powered (Gemini)"})


if __name__ == "__main__":
    print("\nNexBot starting...")
    print("Open: http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000)