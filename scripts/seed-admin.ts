import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import "dotenv/config";

async function seedAdmin() {
  const sql = neon(process.env.DATABASE_URL!);
  console.log(sql);

  const passwordHash = await bcrypt.hash("Koemsak@2020", 12);

  await sql`
    INSERT INTO admin_users (username, email, password_hash, full_name)
    VALUES ('koemsak.mean', 'koemsak.mean@gmail.com', ${passwordHash}, 'Admin')
    ON CONFLICT (username) DO UPDATE SET password_hash = ${passwordHash}
  `;

  console.log("✅ Admin user seeded successfully");
  console.log("   Username: admin");
  console.log("   Password: Koemsak@2020");
}

seedAdmin().catch(console.error);