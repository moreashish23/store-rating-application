require("dotenv").config({ path: "../.env" });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const SALT_ROUNDS = 12;

  // Create Admin
  const adminPassword = await bcrypt.hash("Admin@12345secure", SALT_ROUNDS);
  const admin = await prisma.user.create({
    data: {
      name: "System Administrator Account",
      email: "admin@storerating.com",
      password: adminPassword,
      address: "123 Admin Street, System City, Maharashtra India",
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Create Normal Users
  const user1Password = await bcrypt.hash("User1@12345secure", SALT_ROUNDS);
  const user1 = await prisma.user.create({
    data: {
      name: "Rahul Kumar Software Developer",
      email: "rahul.kumar@example.com",
      password: user1Password,
      address: "45 MG Road Bangalore Karnataka India 560001",
      role: "USER",
    },
  });

  const user2Password = await bcrypt.hash("User2@12345secure", SALT_ROUNDS);
  const user2 = await prisma.user.create({
    data: {
      name: "Priya Sharma Marketing Executive",
      email: "priya.sharma@example.com",
      password: user2Password,
      address: "78 Connaught Place New Delhi India 110001",
      role: "USER",
    },
  });

  const user3Password = await bcrypt.hash("User3@12345secure", SALT_ROUNDS);
  const user3 = await prisma.user.create({
    data: {
      name: "Amit Patel Business Analyst",
      email: "amit.patel@example.com",
      password: user3Password,
      address: "12 CG Road Ahmedabad Gujarat India 380009",
      role: "USER",
    },
  });

  console.log("Normal users created:", user1.email, user2.email, user3.email);

  // Create Store Owners
  const owner1Password = await bcrypt.hash("Owner1@12345secure", SALT_ROUNDS);
  const owner1 = await prisma.user.create({
    data: {
      name: "Suresh Reddy Electronics Store Owner",
      email: "suresh.reddy@techmart.com",
      password: owner1Password,
      address: "56 Jubilee Hills Hyderabad Telangana India 500033",
      role: "STORE_OWNER",
    },
  });

  const owner2Password = await bcrypt.hash("Owner2@12345secure", SALT_ROUNDS);
  const owner2 = await prisma.user.create({
    data: {
      name: "Meena Iyer Fashion Boutique Owner",
      email: "meena.iyer@fashionhub.com",
      password: owner2Password,
      address: "34 Anna Nagar Chennai Tamil Nadu India 600040",
      role: "STORE_OWNER",
    },
  });

  const owner3Password = await bcrypt.hash("Owner3@12345secure", SALT_ROUNDS);
  const owner3 = await prisma.user.create({
    data: {
      name: "Vikram Singh Food Restaurant Owner",
      email: "vikram.singh@foodcorner.com",
      password: owner3Password,
      address: "89 FC Road Pune Maharashtra India 411004",
      role: "STORE_OWNER",
    },
  });

  console.log("Store owners created:", owner1.email, owner2.email, owner3.email);

  // Create Stores
  const store1 = await prisma.store.create({
    data: {
      name: "TechMart Electronics and Gadgets Store",
      email: "contact@techmart.com",
      address: "56 Jubilee Hills Hyderabad Telangana India 500033",
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: "Fashion Hub Trendy Clothing Boutique",
      email: "hello@fashionhub.com",
      address: "34 Anna Nagar Chennai Tamil Nadu India 600040",
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: "Food Corner Multi Cuisine Restaurant",
      email: "info@foodcorner.com",
      address: "89 FC Road Pune Maharashtra India 411004",
      ownerId: owner3.id,
    },
  });

  console.log("Stores created:", store1.name, store2.name, store3.name);

  // Create Ratings
  await prisma.rating.createMany({
    data: [
      { value: 5, userId: user1.id, storeId: store1.id },
      { value: 4, userId: user2.id, storeId: store1.id },
      { value: 3, userId: user3.id, storeId: store1.id },
      { value: 4, userId: user1.id, storeId: store2.id },
      { value: 5, userId: user2.id, storeId: store2.id },
      { value: 4, userId: user3.id, storeId: store2.id },
      { value: 3, userId: user1.id, storeId: store3.id },
      { value: 4, userId: user2.id, storeId: store3.id },
      { value: 5, userId: user3.id, storeId: store3.id },
    ],
  });

  console.log("Ratings created.");
  console.log("\n=== SEED COMPLETE ===");
  console.log("Login credentials:");
  console.log("Admin     -> admin@storerating.com        / Admin@12345secure");
  console.log("User 1    -> rahul.kumar@example.com      / User1@12345secure");
  console.log("User 2    -> priya.sharma@example.com     / User2@12345secure");
  console.log("User 3    -> amit.patel@example.com       / User3@12345secure");
  console.log("Owner 1   -> suresh.reddy@techmart.com    / Owner1@12345secure");
  console.log("Owner 2   -> meena.iyer@fashionhub.com    / Owner2@12345secure");
  console.log("Owner 3   -> vikram.singh@foodcorner.com  / Owner3@12345secure");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });