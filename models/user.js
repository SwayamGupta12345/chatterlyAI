import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb.js';

export async function createUser({ name, email, nickname }) {
  const { db } = await connectToDatabase();
  const result = await db.collection('users').insertOne({
    name,
    email,
    nickname: nickname || null,
    chats: [],
  });
  return result.insertedId;
}

export async function addUserChat(userId, chatId) {
  const { db } = await connectToDatabase();
  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    { $push: { chats: new ObjectId(chatId) } }
  );
}
