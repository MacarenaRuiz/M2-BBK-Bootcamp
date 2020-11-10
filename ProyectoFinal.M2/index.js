//0. Iniciamos servidor
//1. Importamos express y mongodb

const express = require("express");
const mongodb = require("mongodb");

//3.Creamos el objeto mongoClient para que nos permita conectarnos a un servidor mongodb 
const mongoClient = mongodb.MongoClient;

let db; //Hemos creado esta variable para almacenar la base de datos (camle-info)

//4.Nos conectamos al mongodb y hacemos una condicional para saber si nos hemos conectado correctamente con la base de datos.

mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
    if (err !== null) {
        console.log(err);
        return err;
    } else {
        db = client.db('camle');
    }
})


//5.Iniciamos el servidor e indicamos al servidor q use archivos de static public
const app = express();

app.use(express.static('public'));
app.use(express.json());

//6. POST, para agregar nuevos contactos
app.post('/contacto', function (req, res) {
    //7. Creamos el objeto contacto y toda la info q el usuario introducirá como objeto (body)
    let contacto = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        telefono: req.body.telefono,
        correo: req.body.correo,
        comentario: req.body.comentario
    }
    console.log(contacto);
    //9. Añadimos los contactos a la colección camle-info
    db.collection('camle-info').insertOne(contacto, function (err, result) {
        if (err !== null) {
            res.send("No se ha realizado la solicitud correctamente, intente de nuevo y disculpe las molestias.");
        } else {
            res.send({ mensaje: "La solicitud se ha enviado correctamente." })
        }
    })
});


// GET, para ver todos los contactos
app.get('/camle-info', function (req, res) {
    db.collection('camle-info').find().toArray(function (err, respuesta) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        } else {
            res.send(respuesta);
        }
    })
});


//DELETE en baseDatosContacto
app.delete('/eliminarContacto/:apellido', function (req, res) {
    let apellido = req.params.apellido;
    console.log(apellido);
    db.collection('camle-info').deleteOne({ apellido: apellido }, function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log(result); //resultado de borrar un elemento
            if (result.deletedCount === 1) {
                db.collection('camle-info').find().toArray(function (err, respuesta) {
                    if (err !== null) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.send(respuesta);
                        
                    }
                })
            } else {
                res.send({ mensaje: "No se ha borrado el contacto de la basea de datos, intente de nuevo" });
            }

        }
    });
});


//6. Añadimos el puerto
app.listen(3000);
