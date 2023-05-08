import express from 'express';
import './database/index';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(8000, () => {
    console.log('Servidor Rodando!');
});