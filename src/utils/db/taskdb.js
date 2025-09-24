import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name: 'TaskDB',
        location: 'default'
    },
    () => { },
    error => {
        console.log('Error opening database: ', error);
    }
);

export const createTables = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(`CREATE TABLE IF NOT EXISTS tasks 
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT NOT NULL, 
                 updatedDate INTEGER NOT NULL);`,
                [],
                () => {
                    resolve();
                },
                error => {
                    console.log('Error creating table: ', error);
                    reject(error);
                }
            );
        })
    });
}

export const getTasks = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM tasks ORDER BY updatedDate DESC;`,
                [],
                (tx, results) => {
                    // let tasks = [];
                    // for (let i = 0; i < results.rows.length; i++) {
                    //     tasks.push(results.rows.item(i));
                    // }
                    resolve(results.rows.raw());
                },
                error => {
                    console.log('Error fetching tasks: ', error);
                    reject(error);
                }
            );
        });
    });
}

export const insertTask = (title) => {
    return new Promise((resolve, reject) => {
        const updatedDate = Date.now();
        db.transaction(txn => {
            txn.executeSql(
                `INSERT INTO tasks (title, updatedDate) VALUES (?, ?);`,
                [title, updatedDate],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        resolve({   id: results.insertId, title, updatedDate });
                    } else {
                        reject('Failed to add task');
                    }
                },
                error => {
                    console.log('Error adding task: ', error);
                    reject(error);
                }
            );
        });
    });
}

export const updateTaskDB = (id, title) => {
    return new Promise((resolve, reject) => {
        const updatedDate = Date.now();
        db.transaction(txn => {
            txn.executeSql(
                `UPDATE tasks SET title = ?, updatedDate = ? WHERE id = ?;`,
                [title, updatedDate, id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        resolve({ id, title, updatedDate });
                    } else {
                        reject('Failed to update task');
                    }
                },
                error => {
                    console.log('Error updating task: ', error);
                    reject(error);
                }
            );
        });
    });
}

export const deleteTaskDB = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                `DELETE FROM tasks WHERE id = ?;`,
                [id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        resolve();
                    } else {
                        reject('Failed to delete task');
                    }
                },
                error => {
                    console.log('Error deleting task: ', error);
                    reject(error);
                }
            );
        });
    });
}

export default db;