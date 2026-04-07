import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let cachedUri: string | null = null;

export async function getDb(mongoUri: string): Promise<Db> {
    // If URI changed (shouldn't happen) or no client, create new connection
    if (!client || cachedUri !== mongoUri) {
        if (client) {
            try { await client.close(); } catch { /* ignore */ }
        }
        client = new MongoClient(mongoUri);
        cachedUri = mongoUri;
        await client.connect();
    }
    return client.db();
}

export interface UserDoc {
    email: string;
    status: 'pending' | 'paid';
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date | null;
    reminderSentAt: Date | null;
}

