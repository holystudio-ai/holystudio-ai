import { MongoClient, Db } from 'mongodb';
import { config } from '../config.js';

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
    if (!config.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set');
    }

    if (!client) {
        client = new MongoClient(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 15000,
            maxPoolSize: 10,
            minPoolSize: 1,
        });

        try {
            await client.connect();
            console.log('✅ MongoDB connected');
        } catch (err) {
            client = null;
            throw new Error(`MongoDB connect failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    return client.db();
}

export async function closeDb() {
    if (client) {
        await client.close();
        client = null;
        console.log('MongoDB connection closed');
    }
}

