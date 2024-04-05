// PARSE .ENV

const dotenv = require('dotenv');
dotenv.config({ path: '.env.master' });
// FOR SERVER
// CHECK WITH PROTOCOL TO USE
const http = require('http')

const express = require('express') // NODE FRAMEWORK
const bodyParser = require('body-parser') // TO PARSE POST REQUEST
const cors = require('cors') // ALLOW CROSS ORIGIN REQUESTS

// ---------------------------    SERVER CONFIGS ----------------------------------
const port = process.env.PORT || 8000
const app = express();
const actuator = require('express-actuator');

require('./config/global'); // GLOBAL SETTINGS FILES

const server = http.createServer(app)


app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);


app.get("/",(req,res)=>{
    res.status(200).send({msg:"Welcome to event management"})
})
// ------------------------    Cron job    -------------------
require('./config/cron_job');

// --------------------------    ROUTES    ------------------
const appRoutes = require("./routes");
appRoutes(app)

// --------------------------    START SERVER    ---------------------
app.listen(port,console.log(`Server is running at: ${port}`))