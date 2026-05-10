const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const products = [
  { name: 'Pâine de casă cu maia', category: 'Panificație', price: 12, stock: 40, description: 'Pâine realizată in-house din făină de grâu și maia naturală.', imageUrl: '/placeholder.svg', active: true },
  { name: 'Zacuscă de legume', category: 'Conserve', price: 18, stock: 25, description: 'Preparată din legume locale, potrivită pentru consum rapid.', imageUrl: '/placeholder.svg', active: true },
  { name: 'Suc natural de mere', category: 'Băuturi', price: 15, stock: 30, description: 'Suc presat la rece din mere cultivate local.', imageUrl: '/placeholder.svg', active: true },
  { name: 'Brânză proaspătă', category: 'Lactate', price: 22, stock: 18, description: 'Produs lactat local, proaspăt și ambalat pentru vânzare online.', imageUrl: '/placeholder.svg', active: true },
  { name: 'Dulceață de căpșuni', category: 'Conserve', price: 16, stock: 20, description: 'Dulceață preparată în loturi mici, fără conservanți artificiali.', imageUrl: '/placeholder.svg', active: true },
  { name: 'Miere polifloră', category: 'Apicole', price: 28, stock: 15, description: 'Miere provenită de la producători locali.', imageUrl: '/placeholder.svg', active: true }
];

async function main() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB || 'azure_food_shop');
  await db.collection('products').deleteMany({});
  await db.collection('products').insertMany(products);
  await db.collection('users').updateOne(
    { email: 'admin@example.com' },
    { $set: { name: 'Admin', email: 'admin@example.com', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin', createdAt: new Date() } },
    { upsert: true }
  );
  console.log('Seed complet. Admin: admin@example.com / admin123');
  await client.close();
}
main().catch(err => { console.error(err); process.exit(1); });
