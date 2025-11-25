const fs = require('fs');
const path = require('path');

exports.getMenu = (req, res) => {
  try {
    const menuPath = path.join(__dirname, '../menu.json');
    const menuData = fs.readFileSync(menuPath, 'utf8');
    const menu = JSON.parse(menuData);
    res.json(menu);
  } catch (error) {
    console.error('Error reading menu:', error);
    res.status(500).json({ error: 'Failed to load menu' });
  }
};
