import * as SQLite from 'expo-sqlite';

export type Invoice = {
    id?: number;
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

// Fonction pour initialiser la base de données
export const initDB = async (): Promise<void> => {
    try {
        if (!db) {
            db = await SQLite.openDatabaseAsync('invoices.db');
        }
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

// Vérifie si la base de données est prête
const ensureDBInitialized = async (): Promise<void> => {
    if (!db) {
        console.warn("Database is not initialized, initializing now...");
        await initDB();
    }
};

// Ajoute une nouvelle facture
export const addInvoice = async (invoice: Invoice): Promise<void> => {
    const invoiceStatus = "unpaid"
    await ensureDBInitialized();
    try {
        await db!.runAsync(
            `INSERT INTO invoices (date, client, company, description, unit_price, quantity, total, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                invoice.date,
                invoice.client,
                invoice.company,
                invoice.description,
                invoice.unit_price,
                invoice.quantity,
                invoice.total,
                invoiceStatus,
            ]
        );
    } catch (error) {
        console.error('Add Invoice Error:', error);
    }
};

// Récupère toutes les factures
export const getInvoices = async (): Promise<Invoice[]> => {
    await ensureDBInitialized();
    try {
        const result = await db!.getAllAsync<Invoice>('SELECT * FROM invoices;');
        return result;
    } catch (error) {
        console.error('Get Invoices Error:', error);
        return [];
    }
};

// Met à jour le statut d'une facture
export const updateInvoiceStatus = async (id: number): Promise<void> => {
    await ensureDBInitialized();
    try {
        await db!.runAsync(`UPDATE invoices SET status = 'paid' WHERE id = ?;`, [id]);
    } catch (error) {
        console.error('Update Invoice Error:', error);
    }
};

// Exporte la fonction d'initialisation
export { ensureDBInitialized };

export default db;
