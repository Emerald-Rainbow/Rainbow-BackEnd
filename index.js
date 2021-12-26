const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
var blogController = require('./controllers/blogController')
//initialize admin SDK using serciceAcountKey


const app = express();




// var options = {
//   customCss: '.swagger-ui .topbar { display: none }'
// };

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

//app.set('view engine','ejs');
app.use(express.json());
//app.use(express.bodyParser());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({extended: true}));

blogController(app);

app.listen(4000);
console.log('You are listening to port 3000');