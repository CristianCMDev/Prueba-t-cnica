
const db = require("./db");

const insertStock = db.prepare(`
    INSERT OR IGNORE INTO stock (sku, available)
    VALUES (?, ?)
`);

const products = [
    ["SAMSUNG#PROD-001", 25],
    ["APPLE#PROD-001", 10],
    ["OPPO#PROD-001", 50],
    ["XIAOMI#PROD-001", 20],
    ["MOTOROLA#PROD-001", 14],
    ["HUAWEI#PROD-001", 5],
    ["HONOR#PROD-001", 12],
    ["REALME#PROD-001", 35],
    ["VIVO#PROD-001", 9],
    ["NOKIA#PROD-001", 22],
    ["ASUS#PROD-001", 8],
    ["SONY#PROD-001", 16],
    ["GOOGLE#PROD-001", 30],
    ["ONEPLUS#PROD-001", 11],
    ["ZTE#PROD-001", 27],
    ["TECNO#PROD-001", 19],
    ["INFINIX#PROD-001", 0],
    ["LENOVO#PROD-001", 33],
    ["TCL#PROD-001", 7],
    ["ALCATEL#PROD-001", 18]
];

const seed = db.transaction(() => {
    for (const product of products) {
        insertStock.run(...product);
    }
});

seed();

console.log("Stock inicial preparado");
