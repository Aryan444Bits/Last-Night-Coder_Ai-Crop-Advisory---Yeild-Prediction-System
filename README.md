# Farm Ai

**Team Name :** Last Night Coder

**Project Name :** Farm Ai

**Track :** 03 (AgriTech, Health & Sustainability)

## Team Members

| Name | Role | Roll Number |
|---|---|---|
| Aryan Baranwal | Team Leader | 2300560100063 |
| Abhineet Singh | Member-2 | 2300560100005 |
| Apoorv Nigam | Member-3 | 2300560100059 |
| Agam Nigam | Member-4 | 2300560100022 |

---

## 🌾 AI Crop Advisory & Yield Prediction System

A comprehensive Smart Agriculture AI system that combines machine learning-powered crop yield prediction with AI-driven agricultural advisory services. This system helps farmers make data-driven decisions to optimize crop production and manage agricultural risks effectively.

### 🚀 Live Demo
**[Access the Live Application](https://ai-crop-advisory-yeild-prediction-system.onrender.com)**

---

## 📋 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Supported Crops & Regions](#-supported-crops--regions)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 **Dual Functionality System**
1. **Crop Yield Prediction**
   - Machine Learning-powered prediction using RandomForest algorithm
   - Predicts crop yield based on environmental and agricultural factors
   - Supports 100+ countries and 10 major crop types
   - Considers year, rainfall, pesticides usage, and temperature

2. **AI Crop Advisory**
   - Intelligent agricultural advice using Groq's Llama 3.1 AI model
   - Personalized recommendations for crop management
   - Expert-level guidance on planting, harvesting, and crop care
   - Real-time AI responses with agricultural best practices

### 🎨 **Modern Web Interface**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Interactive Forms**: User-friendly input forms with validation
- **Real-time Results**: Instant predictions and recommendations
- **Professional UI**: Clean, modern interface with smooth animations

### 🌍 **Global Coverage**
- **100+ Countries**: Extensive geographical coverage for worldwide usage
- **10 Major Crops**: Support for the most important global food crops
- **Fuzzy Matching**: Intelligent input matching for better user experience
- **Multilingual Support**: Ready for international deployment

---

## 🛠 Technologies Used

### **Backend**
- **Flask** - Python web framework for API development
- **NumPy & Pandas** - Data processing and numerical computations
- **Scikit-learn** - Machine learning model implementation
- **Pickle** - Model serialization and deployment
- **Requests** - HTTP client for AI API integration

### **Frontend** 
- **HTML5 & CSS3** - Modern web standards
- **JavaScript (ES6+)** - Interactive functionality
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Advanced layout techniques

### **AI & ML**
- **RandomForest Algorithm** - Yield prediction model
- **Groq Llama 3.1** - Advanced AI for crop advisory
- **Data Preprocessing** - Feature engineering and validation

### **Deployment**
- **Render** - Cloud hosting platform
- **Gunicorn** - Python WSGI HTTP Server
- **Environment Variables** - Secure configuration management

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)                  │
│                   ┌─────────────────────────┐               │
│                   │  Crop Advisory Module   │               │
│                   └─────────────────────────┘               │
│                   ┌─────────────────────────┐               │
│                   │ Yield Prediction Module │               │
│                   └─────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Flask Backend API                      │
│  ┌─────────────────────┐ ┌─────────────────────────────────┐│
│  │   /predict endpoint │ │    /api/advisory endpoint       ││
│  │                     │ │                                 ││
│  │  RandomForest ML    │ │      Groq AI Integration       ││
│  │     Model           │ │       (Llama 3.1-8B)           ││
│  └─────────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Processing Layer                   │
│                                                             │
│  • Input Validation        • Feature Engineering           │
│  • Fuzzy Matching          • Model Preprocessing           │
│  • Data Transformation     • Response Formatting           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-crop-advisory-yield-prediction-system.git
   cd ai-crop-advisory-yield-prediction-system
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux  
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   Open your browser and navigate to: `http://localhost:5000`

---

## 📖 Usage

### **Crop Yield Prediction**
1. Navigate to the "Yield Prediction" tab
2. Fill in the required parameters:
   - **Year**: Target year for prediction
   - **Rainfall**: Average rainfall (mm/year)
   - **Pesticides**: Pesticides usage (tonnes)
   - **Temperature**: Average temperature (°C)
   - **Area/Country**: Select from 100+ supported regions
   - **Crop Type**: Choose from 10 supported crops
3. Click "Predict Yield" to get ML-powered predictions
4. View results in both hectograms and kilograms

### **AI Crop Advisory**
1. Navigate to the "Crop Advisor" tab
2. Enter the crop name you need advice for
3. Click "Get AI Advisory" for intelligent recommendations
4. Receive comprehensive agricultural guidance including:
   - Optimal planting conditions
   - Care and maintenance tips
   - Harvesting recommendations
   - Risk management strategies

---

## 🔌 API Endpoints

### **Yield Prediction API**
```http
POST /predict
Content-Type: application/x-www-form-urlencoded

Parameters:
- Year: string
- average_rain_fall_mm_per_year: string  
- pesticides_tonnes: string
- avg_temp: string
- Area: string
- Item: string
```

**Response:**
```json
{
  "success": true,
  "predicted_yield_hg": 12345.67,
  "predicted_yield_kg": 1234.57,
  "matched_area": "India",
  "matched_item": "Rice, paddy"
}
```

### **Crop Advisory API** 
```http
POST /api/advisory
Content-Type: application/json

{
  "crop": "rice"
}
```

**Response:**
```json
{
  "success": true,
  "advisory": {
    "crop": "Rice",
    "planting_season": "Monsoon",
    "soil_requirements": "...",
    "care_instructions": "...",
    "harvesting_tips": "..."
  }
}
```

### **Valid Inputs API**
```http
GET /api/valid-inputs
```

---

## 🌱 Supported Crops & Regions

### **Supported Crops (10)**
| Crop | Scientific Context |
|------|-------------------|
| **Cassava** | Tropical root vegetable, drought-resistant |
| **Maize** | Corn, staple cereal crop |
| **Plantains** | Cooking bananas, tropical fruit |
| **Potatoes** | Tuber crop, global staple |
| **Rice, paddy** | Staple grain, aquatic cultivation |
| **Sorghum** | Drought-tolerant cereal grain |
| **Soybeans** | Protein-rich legume crop |
| **Sweet potatoes** | Nutritious root vegetable |
| **Wheat** | Major cereal grain, global staple |
| **Yams** | Tropical tuber crop |

### **Supported Regions (100+)**
The system supports agricultural data from over 100 countries across all continents:
- **Africa**: Nigeria, Kenya, South Africa, Ghana, Egypt, etc.
- **Asia**: India, China, Indonesia, Bangladesh, Pakistan, etc.
- **Europe**: Germany, France, Italy, Spain, Ukraine, etc.
- **Americas**: USA, Brazil, Argentina, Canada, Mexico, etc.
- **Oceania**: Australia, New Zealand, Papua New Guinea

---

##  Deployment

The application is deployed on **Render** and accessible at:
**[https://ai-crop-advisory-yeild-prediction-system.onrender.com](https://ai-crop-advisory-yeild-prediction-system.onrender.com)**

### **Deployment Configuration**
- **Platform**: Render Cloud Platform
- **Runtime**: Python 3.x
- **Web Server**: Gunicorn WSGI server
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment**: Production-ready with environment variables

### **Deploy Your Own Instance**

1. **Fork this repository**
2. **Create a Render account** at [render.com](https://render.com)
3. **Connect your GitHub repository**
4. **Set environment variables**:
   - `GROQ_API_KEY`: Your Groq API key
5. **Deploy with one click**

---

## 🤝 Contributing

We welcome contributions to improve the Smart Agriculture AI system!

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow PEP 8 coding standards for Python
- Write clear, commented code
- Test your changes thoroughly
- Update documentation as needed

### **Areas for Contribution**
- 🌾 Add support for more crop types
- 🗺 Expand geographical coverage
- 🤖 Enhance AI advisory capabilities
- 📱 Improve mobile responsiveness
- 🔧 Optimize ML model performance
- 🌍 Add multi-language support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Last Night Coder Team**
- **Project Lead**: Aryan Baranwal
- **GitHub**: [Project Repository](https://github.com/yourusername/ai-crop-advisory-yield-prediction-system)
- **Live Demo**: [ai-crop-advisory-yeild-prediction-system.onrender.com](https://ai-crop-advisory-yeild-prediction-system.onrender.com)

---

## 🙏 Acknowledgments

- **Groq** for providing the Llama 3.1 AI model API
- **Render** for reliable cloud hosting platform
- **Scikit-learn** community for excellent ML libraries
- **Flask** team for the robust web framework
- **Agricultural research community** for domain knowledge

---

**⭐ Star this repository if you find it helpful!**

*Built with ❤️ for sustainable agriculture and food security*