const usermodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    Users`,
getByID:`
    SELECT
    *
    FROM
     Users
    WHERE
      id = ?
`,
addRow: `
    INSERT INTO
    Users (
     username,
     email,
     password,
     name,
     lastname,
     phone_number,
     role_id,
     id_isactive
    ) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
getByUsername: `
    SELECT 
        id 
    FROM
        Users
    WHERE
        username = ?
        `,
getByEmail:`
    SELECT
        id
    FROM
        Users
    WHERE
        email = ?`,
updateRow: `
    PENDIENTE`,
deleteRow:`
UPDATE
    Users
SET
    id_isactive =0
WHERE
    id =?`,
}

module.exports = usermodels;