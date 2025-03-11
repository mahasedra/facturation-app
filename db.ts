import * as SQLite from 'expo-sqlite';

export type Invoice = {
    id?: number;
    number: string;
    date: string;
    client: string;
    company: string;
    description: string;
    unit_price: number;
    quantity: number;
    total: number;
    status: string;
};

let db: SQLite.SQLiteDatabase | null = null;

// Ouvre la base de données de manière asynchrone
export const initDB = async (): Promise<void> => {
    try {
        db = await SQLite.openDatabaseAsync('invoices.db');
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT NOT NULL,
        date TEXT NOT NULL,
        client TEXT NOT NULL,
        company TEXT NOT NULL,
        description TEXT NOT NULL,
        unit_price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'unpaid'
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

// Ajoute une nouvelle facture
export const addInvoice = async (invoice: Invoice): Promise<void> => {
    if (!db) {
        console.error('Database is not initialized');
        return;
    }
    try {
        await db.runAsync(
            `INSERT INTO invoices (number, date, client, company, description, unit_price, quantity, total, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                invoice.number,
                invoice.date,
                invoice.client,
                invoice.company,
                invoice.description,
                invoice.unit_price,
                invoice.quantity,
                invoice.total,
                invoice.status,
            ]
        );
        console.log('Invoice added successfully');
    } catch (error) {
        console.error('Add Invoice Error:', error);
    }
};

// Récupère toutes les factures
export const getInvoices = async (): Promise<Invoice[]> => {
    if (!db) {
        console.error('Database is not initialized');
        return [];
    }
    try {
        const result = await db.getAllAsync<Invoice>('SELECT * FROM invoices;');
        return result;
    } catch (error) {
        console.error('Get Invoices Error:', error);
        return [];
    }
};

// Met à jour le statut d'une facture
export const updateInvoiceStatus = async (id: number): Promise<void> => {
    if (!db) {
        console.error('Database is not initialized');
        return;
    }
    try {
        await db.runAsync(`UPDATE invoices SET status = 'paid' WHERE id = ?;`, [id]);
        console.log(`Invoice ${id} marked as paid`);
    } catch (error) {
        console.error('Update Invoice Error:', error);
    }
};

export default db;
