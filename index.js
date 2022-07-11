const express = require('express');
const app = express();
require('dotenv').config();
const Port = process.env.PORT || 8080;
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { Console } = require('console');
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
const conectar = (conexion.connect((error) => {
        if (error) throw error;
        console.log('Base de Datos Conectada!!');
    })
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.get('/', (req, res) =>{
    res.render('login')
});
app.get('/hacemos', (req, res) =>{
    res.render('hacemos', {titulo: 'Hacemos'})
}
);

app.get('/quienes', (req, res) =>{
    res.render('quienes', {titulo: 'Quienes'})
}
);

app.get('/retiros', (req, res) =>{
    res.render('retiros', {titulo: 'retiros'})
}
);
app.post('/retiros', (req, res) =>{
    
    const { nombreyapellido,dirretiro,provincia,ciudad,hora,fecha,caracteristicas,dniretiro,fechaentrega,horaentrega,direntrega,ciudadentrega,provinciaentrega,precio} = req.body;
    let sql = `INSERT INTO PEDIDOS (nombreyapellido,dirretiro,provincia,ciudad,hora,fecha,caracteristicas,dniretiro,fechaentrega,horaentrega,direntrega,ciudadentrega,provinciaentrega,precio) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let values = [nombreyapellido,dirretiro,provincia,ciudad,hora,fecha,caracteristicas,dniretiro,fechaentrega,horaentrega,direntrega,ciudadentrega,provinciaentrega,precio];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log('Registro Insertado');
        res.redirect('tomarpedidos');
    }
    );
}
);



















        
//seccion de login

app.get('/register', (req, res) =>{
    res.render('register', {titulo: 'USUARIO NO REGISTRADO'})
}
);









































//registro con contraseña cifrada
app.post('/register', (req, res) =>{
    const { usuario, contrasena } = req.body;
    const contrasenaHash = bcrypt.hashSync(contrasena, 10);
    let sql = `INSERT INTO USUARIOS (usuario, contrasena) VALUES (?,?)`;
    let values = [usuario, contrasenaHash];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log('Registro Insertado');
        res.render ('login' , {titulo: 'USUARIO REGISTRADO CON EXITO // INGRESA EL USUARIO Y CONTRASEÑA QUE REGISTRASTE'});
    }
    );
}
);






app.get('/login', (req, res) =>{
res.render('login', {titulo: 'USUARIO NO REGISTRADO'})
}
);


//autenticacion login
app.post('/login', (req, res) =>{
    const { usuario, contrasena } = req.body;
    let sql = `SELECT * FROM USUARIOS WHERE usuario = ?`;
    
    let values = [usuario];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log(results);
        if (results.length > 0) {
            const contrasenaHash = results[0].contrasena;
            const contrasenaValida = bcrypt.compareSync(contrasena, contrasenaHash);
            if (contrasenaValida) {
                res.render('index', {titulo3: 'USUARIO AUTENTICADO'});
            } else {
                res.render('register', {titulo1: 'USUARIO NO REGISTRADO // REVISA BIEN TUS DATOS O REGISTRATE'});
            }
        } else {
            res.render('register', {titulo1: 'USUARIO NO REGISTRADO // REVISA BIEN TUS DATOS O REGISTRATE'});
            
        }
    }
    );
}
);














//mails
app.get('/footer', (req, res) =>{
    res.render('index', {titulo: 'Mails'})
}
);
app.post('/footer', (req, res) =>{
    const { emails} = req.body;
    let sql = `INSERT INTO MAILS (emails) VALUES (?)`;
    let values = [emails];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log('Registro Insertado');
        res.render ('index' , {titulo4: 'Pronto Recibiras un mail'});
    }
    );
}
);


//editar por id
app.get('/edit/:id', (req, res) =>{
    const { id } = req.params;
    let sql = `SELECT * FROM PEDIDOS WHERE id = ?`;
    let values = [id];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        
   console.log(id);

        res.render('edit', {results});
        
    }
    );
}
);



















app.post('/edit', (req, res) =>{
    const { id, nombreyapellido,dirretiro,provincia,ciudad,hora,fecha,caracteristicas,dniretiro,fechaentrega,horaentrega,direntrega,ciudadentrega,provinciaentrega,precio} = req.body;
    let sql = `UPDATE PEDIDOS SET nombreyapellido = ?, dirretiro = ?, provincia = ?, ciudad = ?, hora = ?, fecha = ?, caracteristicas = ?, dniretiro = ?, fechaentrega = ?, horaentrega = ?, direntrega = ?, ciudadentrega = ?, provinciaentrega = ?, precio = ? WHERE id = ?`;
    let values = [nombreyapellido,dirretiro,provincia,ciudad,hora,fecha,caracteristicas,dniretiro,fechaentrega,horaentrega,direntrega,ciudadentrega,provinciaentrega,precio,id];
    conexion.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log(id);
        console.log('Registro Actualizado');
        res.redirect('/');
    }
    );
}
);





   








        
    













//eliminar campos de pedidos
app.get('/delete/:id', (req, res) =>{
    const id = req.params.id;
    const sql = `DELETE FROM PEDIDOS WHERE id = ?`;
    conexion.query(sql, id, (error, results, fields) => {
        if (error) throw error;
        console.log('Registro Eliminado');
        res.redirect('/tomarpedidos');
    }
    );
}
);



//mostramos los datos de la base de datos
app.get('/tomarpedidos', (req, res) =>{
    const sql = `SELECT * FROM PEDIDOS`;
    conexion.query(sql, (error, results, fields) => {
        if (error) throw error;
        
        res.render('tomarpedidos', {results})

    }
    );
}
);





//escucha el puerto

app.listen(Port, ()=>{
    console.log(`Servidor corriendo en el Puerto ${Port}`);
});
app.on('error', (error) =>{
    console.log(`Tenemos un error ${error}`);
});























































































































































