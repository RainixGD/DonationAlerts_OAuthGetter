const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/getToken', async (req, res) => {
    const { appId, appSecret, appRedirectUri, oauthCode } = req.body;
    try {
        let response = await axios.post("https://www.donationalerts.com/oauth/token", {
            grant_type: "authorization_code",
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: appRedirectUri,
            code: oauthCode,
        });

        if (response.status != 200) {
            res.status(response.status).json(response.data);
        } else {
            res.json({ access_token: response.data.access_token });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the token.' });
    }
});

app.post('/getAccountInfo', async (req, res) => {
    const { access_token } = req.body;

    try {
        let response = await axios.get("https://www.donationalerts.com/api/v1/user/oauth", {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })

        if (response.status != 200) {
            res.status(response.status).send(response.data);
        } else {
            res.send(response.data);
        }
    } catch (error) {
        res.status(500).send('An error occurred while fetching the token.');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});