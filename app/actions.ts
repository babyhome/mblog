"use server";

import client from "@/lib/mongodb";

export async function testDatabaseConnection() {
  let isConnected = false;

  try {
    const mongoClient = await client.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
    return !isConnected;

  } catch (e) {
    console.error(e);
    return isConnected;
  }
}