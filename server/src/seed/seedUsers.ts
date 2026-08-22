import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";
import { Connection } from "../models/Connection";
import { DEMO_USERS } from "./demoUsers";

/**
 * Wipes existing demo data and inserts a fresh set of FluentFeed demo users.
 * Run with: npm run seed (see server/package.json)
 *
 * This intentionally also clears the Connection collection so seeded users
 * always start with a clean slate of no pending/accepted requests between
 * them, giving a predictable demo flow.
 */
async function seed(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

    const deletedUsers = await User.deleteMany({});
    const deletedConnections = await Connection.deleteMany({});
    console.log(
      `Cleared ${deletedUsers.deletedCount} existing users and ${deletedConnections.deletedCount} existing connections.`
    );

    const inserted = await User.insertMany(DEMO_USERS);
    console.log(`Inserted ${inserted.length} demo users:`);
    inserted.forEach((u) => console.log(`  - ${u.name} (${u._id})`));

    console.log("\nSeed complete. Start the client and pick any of the users above from the");
    console.log('"Current User" switcher in the navbar to explore the app.');

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
