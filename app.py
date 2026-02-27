"""
=============================================================
  Smart Agriculture AI System — Unified Flask Backend
  Combines:
    1. Crop Yield Prediction (RandomForest ML Model)
    2. AI Crop Advisory     (Groq Llama 3.1 via API)
=============================================================
"""

from flask import Flask, request, render_template, jsonify
import numpy as np
import pandas as pd
import pickle
import json
import os
import requests
from dotenv import load_dotenv

# ── Load Environment Variables ──
load_dotenv()

# Render assigns the API Key from the 'Environment' tab to this variable
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ─────────────────────────────────────────────

GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load ML models ──
model = pickle.load(open(os.path.join(BASE_DIR, 'model.pkl'), 'rb'))
preprocessor = pickle.load(open(os.path.join(BASE_DIR, 'preprocessor.pkl'), 'rb'))

# ── Load valid inputs for validation & dropdowns ──
with open(os.path.join(BASE_DIR, 'valid_inputs.json')) as f:
    valid_inputs = json.load(f)

VALID_AREAS = [a.lower() for a in valid_inputs['areas']]
VALID_ITEMS = [i.lower() for i in valid_inputs['items']]

# ── Fuzzy-match helper ──
def find_closest(user_input, valid_list_lower, original_list):
    user_input = user_input.strip().lower()
    if user_input in valid_list_lower:
        return original_list[valid_list_lower.index(user_input)]
    for i, v in enumerate(valid_list_lower):
        if user_input in v or v in user_input:
            return original_list[i]
    return None

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
                           areas=valid_inputs['areas'],
                           items=valid_inputs['items'])

# 1. YIELD PREDICTION ENDPOINT
@app.route('/predict', methods=['POST'])
def predict():
    try:
        Year = request.form.get('Year', '').strip()
        average_rain_fall_mm_per_year = request.form.get('average_rain_fall_mm_per_year', '').strip()
        pesticides_tonnes = request.form.get('pesticides_tonnes', '').strip()
        avg_temp = request.form.get('avg_temp', '').strip()
        Area = request.form.get('Area', '').strip()
        Item = request.form.get('Item', '').strip()

        if not all([Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]):
            return jsonify({'success': False, 'error': 'All fields are required.'})

        matched_area = find_closest(Area, VALID_AREAS, valid_inputs['areas'])
        matched_item = find_closest(Item, VALID_ITEMS, valid_inputs['items'])

        if not matched_area:
            return jsonify({'success': False, 'error': f'Country/Area "{Area}" not found.'})

        if not matched_item:
            return jsonify({'success': False, 'error': f'Crop "{Item}" not found.'})

        features = np.array([[
            float(Year),
            float(average_rain_fall_mm_per_year),
            float(pesticides_tonnes),
            float(avg_temp),
            matched_area,
            matched_item
        ]], dtype=object)

        transformed = preprocessor.transform(features)
        predicted_hg = float(model.predict(transformed)[0])
        predicted_kg = round(predicted_hg / 10, 2)

        return jsonify({
            'success': True,
            'predicted_yield_hg': round(predicted_hg, 2),
            'predicted_yield_kg': predicted_kg,
            'matched_area': matched_area,
            'matched_item': matched_item
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# 2. AI CROP ADVISORY ENDPOINT
@app.route('/api/advisory', methods=['POST'])
def advisory():
    data = request.get_json()
    crop = data.get('crop', '').strip() if data else ''

    if not crop:
        return jsonify({'success': False, 'error': 'No crop name provided.'})

    if not GROQ_API_KEY:
        return jsonify({'success': False, 'error': 'Groq API key not set in environment.'})

    prompt = f"""
Provide a comprehensive agricultural advisory for the crop: {crop}.
Return ONLY a valid JSON object. Do not include any text before or after the JSON.
The JSON MUST follow this exact structure:
{{
  "emoji": "🌱",
  "crop": "{crop}",
  "overview": "Short summary of the crop's importance.",
  "best_season": {{ "title": "Best Season", "primary": "Season Name", "details": "Specific planting months" }},
  "yield_info": {{ "title": "Expected Yield", "average": "e.g. 5-7 tons/ha", "market": "e.g. High/Stable" }},
  "fertilizers": {{ "title": "Best Fertilizers", "primary": "Main Fertilizer", "list": ["tip 1", "tip 2"] }},
  "insecticides": {{ "title": "Pest Control", "primary": "Main Pest", "list": ["control 1", "control 2"] }},
  "conditions": {{ "title": "Ideal Conditions", "soil": "Soil type", "water": "Water needs", "sunlight": "Sun needs", "spacing": "Plant spacing" }},
  "techniques": {{ "title": "Farming Techniques", "list": ["tech 1", "tech 2"] }},
  "precautions": {{ "title": "Key Precautions", "list": ["precaution 1", "precaution 2"] }},
  "care_tips": {{ "title": "Care & Pro Tips", "list": ["tip 1", "tip 2"] }},
  "timeline": {{ "title": "Crop Timeline", "phases": [
      {{ "phase": "Germination", "duration": "7-10 days", "details": "Keep soil moist" }},
      {{ "phase": "Vegetative", "duration": "40 days", "details": "Apply nitrogen" }}
    ]
  }}
}}
"""
    # (Note: I kept your prompt logic brief here for space,
    # but ensure your original long prompt is used in your actual file)

    # Replace your try/except block inside advisory() with this:
    try:
        resp = requests.post(
            GROQ_URL,
            headers={'Authorization': f'Bearer {GROQ_API_KEY}'},
            json={
                'model': 'llama-3.1-8b-instant',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.1 # Lower temperature is better for JSON
            },
            timeout=30
        )
        
        raw_content = resp.json()['choices'][0]['message']['content']
        
        # Better cleaning: Find the first '{' and last '}'
        start_idx = raw_content.find('{')
        end_idx = raw_content.rfind('}') + 1
        json_string = raw_content[start_idx:end_idx]
        
        advisory_data = json.loads(json_string)
        return jsonify({'success': True, 'advisory': advisory_data})

    except Exception as e:
        print(f"Error: {e}") # This will show the error in your terminal
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/valid-inputs')
def get_valid_inputs():
    return jsonify(valid_inputs)

# ── RENDER DEPLOYMENT SETTINGS ──
if __name__ == '__main__':
    # Get port from Render (Environment Variable) or default to 5000 for local dev
    port = int(os.environ.get("PORT", 5000))
    
    # host='0.0.0.0' tells Flask to listen on all public IPs (Required for Render)
    # debug=False is recommended for production
    app.run(host='0.0.0.0', port=port, debug=False)