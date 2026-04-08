import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { data, error } = await supabase
    .from('stock_trends')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data.map(item => ({
    id: item.id,
    date: item.date,
    inStock: item.in_stock,
    lowStock: item.low_stock,
    outOfStock: item.out_of_stock
  })));
}
