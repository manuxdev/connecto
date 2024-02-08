import express, { json } from 'express';
import { userRouter } from './routes/users.js';

//json
const app = express();
app.use(json()); // Para poder parsear JSON en las peticiones

app.use('/users', userRouter)

//cors
app.use((req,res, next) =>{
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Acces-Control-Allow-Headers', 'Content-Type');
    next();
})

// Iniciar el servidor
const port = process.env.PORT ||   4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});