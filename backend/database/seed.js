const db = require("./db");

const products = [
    { sku: "SAMSUNG#PROD-001", available: 25 },
    { sku: "APPLE#PROD-001", available: 10 },
    { sku: "OPPO#PROD-001", available: 50 },
    { sku: "XIAOMI#PROD-001", available: 20 },
    { sku: "MOTOROLA#PROD-001", available: 14 },
    { sku: "HUAWEI#PROD-001", available: 5 },
    { sku: "HONOR#PROD-001", available: 12 },
    { sku: "REALME#PROD-001", available: 35 },
    { sku: "VIVO#PROD-001", available: 9 },
    { sku: "NOKIA#PROD-001", available: 22 },
    { sku: "ASUS#PROD-001", available: 8 },
    { sku: "SONY#PROD-001", available: 16 },
    { sku: "GOOGLE#PROD-001", available: 30 },
    { sku: "ONEPLUS#PROD-001", available: 11 },
    { sku: "ZTE#PROD-001", available: 27 },
    { sku: "TECNO#PROD-001", available: 19 },
    { sku: "INFINIX#PROD-001", available: 0 },
    { sku: "LENOVO#PROD-001", available: 33 },
    { sku: "TCL#PROD-001", available: 7 },
    { sku: "ALCATEL#PROD-001", available: 18 }
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