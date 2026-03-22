const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');



/////app initializer
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


/////Route Handel
app.post('/pcode', (req, res) => {
    const { identity, campaignSecret } = req.body;
    //Step1 - Validate the incoming data
    if(!identity || !campaignSecret) {
        return res.status(400).json({ error: 'Missing identity or campaignSecret' });
    }
    //Step2 - Validate the campaignSecret against the environment variable
    const userSecret = process.env.USER_SECRET;
    const campaignSecretEnv = process.env.CAMPAIGN_SECRET;
    if (campaignSecretEnv !== campaignSecret) {
        return res.status(401).json({ error: 'Invalid campaignSecret' });
    }

    //Step3 - Generate a unique code (for demonstration, using a simple hash of identity and campaignSecret)const final_string = req.body.identity + snapshot.val().secret_key;
    const final_string = identity + userSecret;
    const hash = crypto.createHash('sha256');
    hash.update(final_string);
    const pcode = 'pw-' + hash.digest('hex');
    
    res.status(200).json({ pcode });
});


////HTML Client Route
app.get('/', (req, res) => 
{
    res.send("Server is running.");
}

);


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
