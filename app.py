"""
=============================================================
  Smart Agriculture AI System — Unified Flask Backend
  Combines:
    1. Crop Yield Prediction (RandomForest ML Model)
    2. AI Crop Advisory     (Groq Llama 3.1 via API)
=============================================================

  Setup:
    1. pip install flask numpy pandas scikit-learn requests
    2. Paste your Groq API key in GROQ_API_KEY below
       Get a free key at: https://console.groq.com
    3. python app.py
    4. Open http://localhost:5000

=============================================================
"""

from flask import Flask, request, render_template, jsonify
import numpy as np
import pandas as pd
import pickle
import json
import os
import requests

# ─────────────────────────────────────────────
#  🔑  PASTE YOUR GROQ API KEY HERE
#     Get free key at: https://console.groq.com
# ─────────────────────────────────────────────

from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

# ─────────────────────────────────────────────

GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load ML models ──
model       = pickle.load(open(os.path.join(BASE_DIR, 'model.pkl'), 'rb'))
preprocessor = pickle.load(open(os.path.join(BASE_DIR, 'preprocessor.pkl'), 'rb'))

# ── Load valid inputs for validation & dropdowns ──
with open(os.path.join(BASE_DIR, 'valid_inputs.json')) as f:
    valid_inputs = json.load(f)

VALID_AREAS = [a.lower() for a in valid_inputs['areas']]
VALID_ITEMS = [i.lower() for i in valid_inputs['items']]

# ── Fuzzy-match helper: find closest valid entry ──
def find_closest(user_input, valid_list_lower, original_list):
    """Return the best matching valid entry or None if too different."""
    user_input = user_input.strip().lower()
    # Exact match
    if user_input in valid_list_lower:
        return original_list[valid_list_lower.index(user_input)]
    # Partial / substring match
    for i, v in enumerate(valid_list_lower):
        if user_input in v or v in user_input:
            return original_list[i]
    return None

# ── Flask app ──
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html',
                           areas=valid_inputs['areas'],
                           items=valid_inputs['items'])

# ─────────────────────────────────────────────
#  1. YIELD PREDICTION ENDPOINT
# ─────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    try:
        Year                          = request.form.get('Year', '').strip()
        average_rain_fall_mm_per_year = request.form.get('average_rain_fall_mm_per_year', '').strip()
        pesticides_tonnes             = request.form.get('pesticides_tonnes', '').strip()
        avg_temp                      = request.form.get('avg_temp', '').strip()
        Area                          = request.form.get('Area', '').strip()
        Item                          = request.form.get('Item', '').strip()

        # ── Validate required fields ──
        if not all([Year, average_rain_fall_mm_per_year, pesticides_tonnes, avg_temp, Area, Item]):
            return jsonify({'success': False, 'error': 'All fields are required.'})

        # ── Fuzzy match Area and Item ──
        matched_area = find_closest(Area, VALID_AREAS, valid_inputs['areas'])
        matched_item = find_closest(Item, VALID_ITEMS, valid_inputs['items'])

        if not matched_area:
            return jsonify({
                'success': False,
                'error': f'Country/Area "{Area}" not found in our dataset. '
                         f'Supported areas include: {", ".join(valid_inputs["areas"][:10])}... and more.'
            })

        if not matched_item:
            return jsonify({
                'success': False,
                'error': f'Crop "{Item}" not found in our dataset. '
                         f'Supported crops: {", ".join(valid_inputs["items"])}.'
            })

        # ── Build feature array ──
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
        predicted_kg = round(predicted_hg / 10, 2)   # convert hg/ha → kg/ha

        return jsonify({
            'success': True,
            'predicted_yield_hg': round(predicted_hg, 2),
            'predicted_yield_kg': predicted_kg,
            'matched_area': matched_area,
            'matched_item': matched_item
        })

    except ValueError as e:
        return jsonify({'success': False, 'error': f'Invalid numeric input: {str(e)}'})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Prediction failed: {str(e)}'})


# ─────────────────────────────────────────────
#  2. AI CROP ADVISORY ENDPOINT
# ─────────────────────────────────────────────
@app.route('/api/advisory', methods=['POST'])
def advisory():
    data = request.get_json()
    crop = data.get('crop', '').strip() if data else ''

    if not crop:
        return jsonify({'success': False, 'error': 'No crop name provided.'})

    if not GROQ_API_KEY or GROQ_API_KEY == 'your-groq-api-key-here':
        return jsonify({
            'success': False,
            'error': 'Groq API key not set. Open app.py and paste your key into GROQ_API_KEY. '
                     'Get a free key at https://console.groq.com'
        })

    prompt = f"""You are an expert agricultural advisor. Provide comprehensive advisory information for the crop: "{crop}".

Return ONLY valid JSON (no markdown, no extra text) in exactly this structure:
{{
  "crop": "{crop}",
  "emoji": "<a single relevant emoji for the crop>",
  "overview": "<2-3 sentence overview of the crop>",
  "best_season": {{
    "title": "Best Season",
    "primary": "<main growing season>",
    "details": "<detailed season info with months>"
  }},
  "fertilizers": {{
    "title": "Best Fertilizers",
    "primary": "<top fertilizer recommendation>",
    "list": ["<fertilizer 1>", "<fertilizer 2>", "<fertilizer 3>", "<fertilizer 4>"]
  }},
  "insecticides": {{
    "title": "Pest & Disease Control",
    "primary": "<main pest threat>",
    "list": ["<insecticide/treatment 1>", "<insecticide/treatment 2>", "<insecticide/treatment 3>"]
  }},
  "conditions": {{
    "title": "Ideal Conditions",
    "soil": "<best soil type>",
    "water": "<water requirements>",
    "sunlight": "<sunlight needs>",
    "spacing": "<plant spacing>"
  }},
  "techniques": {{
    "title": "Best Farming Techniques",
    "list": ["<technique 1>", "<technique 2>", "<technique 3>", "<technique 4>"]
  }},
  "timeline": {{
    "title": "Crop Timeline",
    "phases": [
      {{"phase": "Land Preparation", "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Sowing / Planting", "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Germination",       "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Vegetative Growth", "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Flowering",         "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Maturation",        "duration": "<X days/weeks>", "details": "<what to do>"}},
      {{"phase": "Harvesting",        "duration": "<X days/weeks>", "details": "<what to do>"}}
    ]
  }},
  "precautions": {{
    "title": "Key Precautions",
    "list": ["<precaution 1>", "<precaution 2>", "<precaution 3>", "<precaution 4>"]
  }},
  "care_tips": {{
    "title": "Care & Pro Tips",
    "list": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"]
  }},
  "yield_info": {{
    "title": "Expected Yield",
    "average": "<average yield per acre/hectare>",
    "market": "<market value info>"
  }}
}}"""

    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {GROQ_API_KEY}'
            },
            json={
                'model': 'llama-3.1-8b-instant',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.3,
                'max_tokens': 1500
            },
            timeout=30
        )

        if not resp.ok:
            return jsonify({'success': False, 'error': f'Groq API error: {resp.status_code}', 'details': resp.text})

        raw = resp.json()['choices'][0]['message']['content']
        cleaned = raw.replace('```json', '').replace('```', '').strip()

        try:
            advisory_data = json.loads(cleaned)
        except Exception:
            return jsonify({'success': False, 'error': 'Failed to parse AI response.', 'raw': cleaned})

        return jsonify({'success': True, 'advisory': advisory_data})

    except requests.Timeout:
        return jsonify({'success': False, 'error': 'Request timed out. Please try again.'})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'})


# ─────────────────────────────────────────────
#  3. VALID INPUTS (for frontend dropdowns)
# ─────────────────────────────────────────────
@app.route('/api/valid-inputs')
def get_valid_inputs():
    return jsonify(valid_inputs)


if __name__ == '__main__':
    print('\n🌿 Smart Agriculture AI System')
    print('   Yield Prediction + AI Crop Advisory')
    if GROQ_API_KEY == 'your-groq-api-key-here':
        print('⚠️  Reminder: Paste your Groq API key in app.py (GROQ_API_KEY)')
        print('   Get a free key at: https://console.groq.com')
    else:
        print('✅ Groq API key loaded.')
    print('🚀 Running at http://localhost:5000\n')
    app.run(debug=True)
