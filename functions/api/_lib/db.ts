import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let cachedUri: string | null = null;

export async function getDb(mongoUri: string): Promise<Db> {
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set');
    }

    // If URI changed or no client, create new connection
    if (!client || cachedUri !== mongoUri) {
        if (client) {
            try { await client.close(); } catch { /* ignore */ }
            client = null;
        }

        client = new MongoClient(mongoUri, {
            // Workers-friendly timeouts
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            // Avoid SRV/DNS issues on Workers
            directConnection: !mongoUri.startsWith('mongodb+srv'),
            // Minimal pool for serverless
            maxPoolSize: 1,
            minPoolSize: 0,
        });
        cachedUri = mongoUri;

        try {
            await client.connect();
        } catch (err) {
            client = null;
            cachedUri = null;
            throw new Error(`MongoDB connect failed: ${err instanceof Error ? err.message : String(err)}`);
        }
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
