/**
 * Seed a test paid order + user in MongoDB.
 *
 * Usage:
 *   cd server && npx tsx scripts/seed-test-user.ts
 *
 * This will:
 *   1. Create (or update) a test user with status=paid
 *   2. Create (or update) a test order with status=paid + botAccessToken
 *   3. Print the Telegram bot link with the token
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
}

const TELEGRAM_BOT = 'HOLYSTUDIO_AI_bot';

// ── Test data ──
const TEST_EMAIL = 'test@holystudio.ai';
const TEST_ORDER_REF = 'HOLY-TEST-20260414';
const TEST_BOT_TOKEN = 'test-token-holy-2026';

async function main() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();

    console.log('✅ Connected to MongoDB\n');

    // 1. Upsert test user
    const userResult = await db.collection('users').updateOne(
        { email: TEST_EMAIL },
        {
            $set: {
                email: TEST_EMAIL,
                status: 'paid',
                paidAt: new Date(),
                updatedAt: new Date(),
                orderReference: TEST_ORDER_REF,
            },
            $setOnInsert: {
                createdAt: new Date(),
            },
        },
        { upsert: true }
    );
    console.log(`👤 User "${TEST_EMAIL}":`, userResult.upsertedCount ? 'CREATED' : 'UPDATED');

    // 2. Upsert test order with botAccessToken
    const orderResult = await db.collection('orders').updateOne(
        { orderReference: TEST_ORDER_REF },
        {
            $set: {
                orderReference: TEST_ORDER_REF,
                email: TEST_EMAIL,
                status: 'paid',
                amount: 490,
                currency: 'UAH',
                botAccessToken: TEST_BOT_TOKEN,
                botAccessTokenUsedAt: null, // reset so it can be used
                updatedAt: new Date(),
            },
            $setOnInsert: {
                createdAt: new Date(),
            },
        },
        { upsert: true }
    );
    console.log(`📦 Order "${TEST_ORDER_REF}":`, orderResult.upsertedCount ? 'CREATED' : 'UPDATED');

    // 3. Print results
    const botLink = `https://t.me/${TELEGRAM_BOT}?start=${TEST_BOT_TOKEN}`;

    console.log('\n' + '═'.repeat(60));
    console.log('🔑 Bot Access Token:', TEST_BOT_TOKEN);
    console.log('📧 Email:', TEST_EMAIL);
    console.log('📦 Order:', TEST_ORDER_REF);
    console.log('═'.repeat(60));
    console.log('\n🤖 Telegram Bot Link (для юзера):');
    console.log(`   ${botLink}`);
    console.log('\n🌐 API verify URL (для SmartSender):');
    console.log(`   https://holystudio-api.onrender.com/api/bot/verify-token?token=${TEST_BOT_TOKEN}`);
    console.log('\n🧪 Local test:');
    console.log(`   curl "http://localhost:3001/api/bot/verify-token?token=${TEST_BOT_TOKEN}"`);
    console.log('');

    await client.close();
}

main().catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
});

