import express from 'express'
import cors from 'cors'
// import { router } from './src/routes/register.router';

export const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: 'https://d3dyzqhp8l13cs.cloudfront.net', 
    methods: 'GET,POST,PUT,DELETE',   
    credentials: true,   
    allowedHeaders: ['Content-Type', 'Authorization']             
  }
))
// app.use('/',router);

const PORT =  5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})