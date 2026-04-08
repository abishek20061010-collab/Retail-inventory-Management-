import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (method === 'PUT') {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: 'All alerts marked read' });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
