const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
//app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
let token = '';
let otp = '';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

app.post('/get-token', async (req, res) => {
    try {
        const url = 'https://demo.wgroup.vn/hsm/auth';
        const response = await axios.post(url, req.body);
        token = response.data && response.data.result && response.data.result.token || 'unknown';
        console.log('token', token)
        res.json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý yêu cầu POST' });
    }
});

app.post('/get-otp', async (req, res) => {
    try {
        let data = JSON.stringify({
            "passcode": req.body.passcode ?? "12345678"
        });
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://demo.wgroup.vn/hsm/otp',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${req.body.token ?? token}`,
            },
            data : data
        };
        console.log('otp', otp)
        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 4));
            otp = response.data && response.data.result && response.data.result && response.data.result.otp_code || 'unknown';
            res.json({otp});
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý yêu cầu POST' });
    }
});

app.post('/e-sign', async (req, res) => {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://demo.wgroup.vn/hsm/pdf',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${req.body.token ?? token}`,
            },
            data : req.body
        };
        axios.request(config)
        .then((response) => {
            console.log('Ký thành công!', new Date())
            //console.log(JSON.stringify(response.data, null, 4));
            res.json({data : response.data});
        })
        .catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý yêu cầu POST' });
    }
});

app.get('/get-hsm-info', (req, res) => {
    try {
        console.log('get-hsm-info => Init..'+ new Date())
        res.json({ token, otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý yêu cầu GET' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
