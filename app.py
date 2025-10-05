from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ Set your Gemini API key from environment variable
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('models/gemini-2.5-flash')

# Serve static files
@app.route('/')
@app.route('/index.html')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.json.get("message", "")

        if not user_input:
            return jsonify({"response": "I didn't receive any input. Please try again."})

        # Use Gemini AI for responses
        prompt = f"""You are AskSFU, the AI assistant for Simon Fraser University. Provide helpful information about SFU-related topics including courses, programs, clubs, campus life, and general university information.

User question: {user_input}

Please provide a helpful and informative response about Simon Fraser University."""
        
        response = model.generate_content(prompt)
        ai_response = response.text
        
        return jsonify({"response": ai_response})

    except Exception as e:
        print("Error:", str(e))  # Debugging in terminal
        return jsonify({"response": f"Error: {str(e)}"})  # Shows actual error in UI

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3001)
