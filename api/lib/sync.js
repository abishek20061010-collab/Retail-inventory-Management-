import { supabase } from './supabase';

export const syncStockLevel = async (productName, currentStock) => {
  try {
    // 1. Sync Customer Portal "In Stock" boolean
    await supabase
      .from('customer_products')
      .update({ in_stock: currentStock > 0 })
      .eq('name', productName);

    // 2. Fetch minThreshold to check for alerts
    const { data: invData } = await supabase
      .from('inventory_products')
      .select('min_threshold')
      .eq('name', productName)
      .single();

    if (invData) {
      const { min_threshold: minThreshold } = invData;
      let alertType = null;
      let alertMsg = null;

      if (currentStock === 0) {
        alertType = 'critical';
        alertMsg = `Stock depleted — auto-reorder triggered`;
      } else if (currentStock < minThreshold) {
        alertType = 'warning';
        alertMsg = `Stock below minimum threshold (${currentStock} units left)`;
      }

      if (alertType) {
        const alertId = 'ALT-' + Date.now() + Math.floor(Math.random() * 1000);
        await supabase
          .from('alerts')
          .insert([{
            id: alertId,
            type: alertType,
            message: alertMsg,
            product_name: productName,
            timestamp: new Date().toISOString(),
            is_read: false
          }]);
      }
    }
  } catch (e) {
    console.error('Sync error:', e);
  }
};
