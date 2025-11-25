# Restaurant Food Ordering Chatbot

## Setup Instructions

### 1. Get Gemini API Key
- Go to https://aistudio.google.com/app/apikey
- Create a free API key
- Copy the API key

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
- Open `.env` file
- Replace `your_gemini_api_key_here` with your actual Gemini API key

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Run the Application

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 5. Access the App
- Open browser: http://localhost:3000

## Features
- Natural language food ordering
- Real-time cart management
- Menu display
- Order checkout with receipt
- Powered by Google Gemini AI

## Usage Examples
- "I want 2 pizzas and 1 coke"
- "Add 3 burgers to my order"
- "What's on the menu?"
- "I'd like pasta and fries"
