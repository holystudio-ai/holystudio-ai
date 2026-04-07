import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI!);
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

