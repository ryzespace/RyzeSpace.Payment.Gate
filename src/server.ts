
import express from 'express';
import config from './config';
import paymentsRouter from './routes/payments.routes';
import webhooksRouter from './routes/webhooks.routes';
import bodyParser from 'body-parser';

const app = express();


app.use(express.json());


app.use('/payments', paymentsRouter);

app.use('/webhooks', webhooksRouter);


app.get('/', (req, res) => res.send('Payments gateway running'));

app.listen(config.PORT, () => {
    console.log(`Payments gateway listening on ${config.PORT}`);
    console.log(`App URL: ${config.APP_URL}`);
});
