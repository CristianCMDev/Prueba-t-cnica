const db = require("./db");

const products = [
  { sku: "PROD-001", available: 25 },
  { sku: "PROD-002", available: 10 },
  { sku: "PROD-003", available: 50 },
  { sku: "PROD-004", available: 0 },
  { sku: "PROD-005", available: 15 },
  { sku: "PROD-006", available: 32 },
  { sku: "PROD-007", available: 8 },
  { sku: "PROD-008", available: 100 },
  { sku: "PROD-009", available: 12 },
  { sku: "PROD-010", available: 5 }
];

const insert = db.prepare(`
  INSERT INTO stock (sku, available)
  VALUES (@sku, @available)
`);

const seed = db.transaction(() => {
  for (const product of products) {
    insert.run(product);
  }
});

seed();

console.log("Seed funcionando");