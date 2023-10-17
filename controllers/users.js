const { request, response } = require('express');
const usersModel = require('../models/users')
const pool = require('../db');

//endpoint
const listUsers = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const users = await conn.query(usersModel.getAll, (err) =>{
            if(err){
                throw err
            }
        });
        
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

//endpoint
const listUserByID = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)){
        res.status(404).json({msg: 'Invalid ID'});
        return;
    }

    let conn;

    try {
        conn = await pool.getConnection();

        const [user] = await conn.query(usersModel.getByID, [id], (err) =>{
            if(err){
                throw err
            }
        });

        if (!user){
            res.status(404).json({msg:'User not found'});
            return;
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////12/10/2023
    /*
    {
                username: 'admin',
                email: 'admin@example.com',
                password: '123',
                name: 'Administrador',
                lastname: 'De sitios',
                phone_number: '55555555',
                role_id: '1',
                is_active: '1', 
    }
    */

const addUser = async (req = request, res = response) => {
    const {
        username,
        email,
        password,
        name,
        lastname,
        phone_number,
        role_id,
        id_isactive = 1
    } = req.body;

    if(!username || !email || !password || !name || !lastname || !role_id){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const user = [username, email, password, name, lastname, phone_number, role_id, id_isactive];

    let conn;

    try{
        conn = await pool.getConnection();
//***********************************
        const [usernameUser] = await conn.query(
            usersModel.getByUsername,
            [username],
            (err) => {if (err) throw err;}
        );
        if(usernameUser) {
            res.status(409).json({msg: `User with ${username} already exists`});
            return;
        }
//****************************
        const [emailUser] = await conn.query(
            usersModel.getByEmail,
            [email],
            (err) => {if (err) throw err;}
        );
        if(emailUser) {
            res.status(409).json({msg: `User whith ${email} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow, [...user], (err) => {
            if(err) throw err;
        });

        if (userAdded.affecteRows === 0) throw new Error({message: 'Failed to add user'});
        res.json({msg: 'User added successfully'});

    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////12/10/2023
module.exports = { listUsers, listUserByID, addUser };