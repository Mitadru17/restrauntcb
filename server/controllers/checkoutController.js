const fs = require('fs');
const path = require('path');

exports.processCheckout = (req, res) => {
  try {
    const { items, total } = req.body;
    
    const orderId = `ORDER-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const receipt = {
      orderId,
      timestamp,
      items,
      total,
      status: 'confirmed'
    };

    const ordersPath = path.join(__dirname, '../orders.json');
    let orders = [];
    
    if (fs.existsSync(ordersPath)) {
      const ordersData = fs.readFileSync(ordersPath, 'utf8');
      orders = JSON.parse(ordersData);
    }
    
    orders.push(receipt);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    res.json({
      success: true,
      receipt,
      message: 'Order confirmed! Your food will be ready soon.'
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process order'
    });
  }
};
