import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('facturation.db');

export const initDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS factures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero TEXT NOT NULL,
        date TEXT NOT NULL,
        client TEXT NOT NULL,
        entreprise TEXT NOT NULL,
        designation TEXT NOT NULL,
        prix_unitaire REAL NOT NULL,
        quantite INTEGER NOT NULL,
        total REAL NOT NULL,
        statut TEXT NOT NULL DEFAULT 'non payé'
      );`
        );
    });
};

export const addFacture = (facture, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO factures (numero, date, client, entreprise, designation, prix_unitaire, quantite, total, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [facture.numero, facture.date, facture.client, facture.entreprise, facture.designation, facture.prix_unitaire, facture.quantite, facture.total, facture.statut],
            (_, result) => callback(result),
            (_, error) => console.log(error)
        );
    });
};

export const getFactures = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            `SELECT * FROM factures;`,
            [],
            (_, { rows }) => callback(rows._array),
            (_, error) => console.log(error)
        );
    });
};

export const updateFactureStatut = (id, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE factures SET statut = 'payé' WHERE id = ?;`,
            [id],
            (_, result) => callback(result),
            (_, error) => console.log(error)
        );
    });
};

export default db;
