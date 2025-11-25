const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getMenu = () => {
  const menuPath = path.join(__dirname, '../menu.json');
  const menuData = fs.readFileSync(menuPath, 'utf8');
  return JSON.parse(menuData);
};

exports.processChat = async (req, res) => {
  try {
    const { message } = req.body;
    const menu = getMenu();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a restaurant ordering assistant. The menu is: ${JSON.stringify(menu)}.

User message: "${message}"

Analyze the user's message and extract:
1. Food items they want to order (must match menu items exactly or find closest match)
2. Quantities for each item (if not specified, assume 1)
3. Calculate total price based on menu prices

Respond ONLY with valid JSON in this exact format:
{
  "items": [{"name": "item_name", "qty": number, "price": number}],
  "total": number,
  "reply": "friendly confirmation message"
}

Rules:
- Match menu items (case-insensitive)
- If item not in menu, return empty items array and polite message
- Calculate total = sum of (qty * price) for all items
- Reply should be natural and friendly
- Price should be per-item price from menu, not total for that item`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      res.json(parsedResponse);
    } else {
      res.json({
        items: [],
        total: 0,
        reply: "I'm sorry, I couldn't understand your order. Could you please try again?"
      });
    }
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      items: [],
      total: 0,
      reply: "I'm having trouble processing your order. Please try again."
    });
  }
};
