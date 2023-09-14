
const inputPdf = document.getElementById('input-pdf');
const inputImg = document.getElementById('input-img');
const getToken = document.getElementById('get-token');
const getOtp = document.getElementById('get-otp');
const eSign = document.getElementById('e-sign');
const showResult = document.getElementById('show-result');
const username = document.getElementById('username');
const password = document.getElementById('password');
const showStatus = document.getElementById('show-status');
const showInfo = document.getElementById('show-info');
const token = document.getElementById('token');
const otp = document.getElementById('otp');
const passcode = document.getElementById('passcode');
const pdf = document.getElementById('pdf');
const signature = document.getElementById('signature');
const loadOption = document.getElementById('load-option');
const printSign = document.getElementById('print-sign');
const updateOption = document.getElementById('update-option');
const defaultOption = document.getElementById('default-option');

const pageNo = document.getElementById('page-no');
const positionIndentifier = document.getElementById('position-indentifier');
const fontStyle = document.getElementById('font-style');
const fontSize = document.getElementById('font-size');
const textColor = document.getElementById('text-color');

const store = localStorage || sessionStorage;

const ShowStatus = (val) => {
    showStatus.innerHTML = val;
}

const ShowInfo = (val) => {
    showInfo.innerHTML = val;
}

const base64Data = (reader) => reader && reader.split(';base64,').pop();
const base64Type = (reader) => reader && reader.substring("data:".length, reader.indexOf(";base64,"));
const renderPdfWithBase64 = (val) => `data:application/pdf;base64,${val}`;

const convertBase64 = (file) => {
    if (!file) return;
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
    });
};

const uploadPdf = async (event) => {
    const file = event.target.files[0];
    store['pdf'] = await convertBase64(file);
    pdf.src = store['pdf'];
    LoadOption();
};

inputPdf.addEventListener('change', (event)=> {
    uploadPdf(event)
})

inputImg.addEventListener('change', async (event)=> {
    store['signature'] = await convertBase64(event.target.files[0]);
    signature.src = store['signature'];
    LoadOption();
})

showInfo.addEventListener('change', async (event)=> {
    store['option'] = event.target.value; 
    ShowInfo(store['option']);
})

pageNo.addEventListener('change', async (event)=> {
    store['PAGENO'] = event.target.value || 0; v
})

positionIndentifier.addEventListener('change', async (event)=> {
    store['POSITIONIDENTIFIER'] = event.target.value || ''; 
    LoadOption();
})

fontStyle.addEventListener('change', async (event)=> {
    store['FONTSTYLE'] = event.target.value || ''; 
    LoadOption();
})

fontSize.addEventListener('change', async (event)=> {
    store['FONTSIZE'] = event.target.value || 0; 
    LoadOption();
})

textColor.addEventListener('change', async (event)=> {
    store['TEXTCOLOR'] = event.target.value || ''; 
    setTimeout(()=> {
        LoadOption();
    },1000)
})


printSign.addEventListener('change', async (event)=> {
    store['printSign'] = event.target.checked.toString(); 
    LoadOption();
})

loadOption.addEventListener('click', async (event)=> {
    console.log('load..', new Date());
    LoadOption();
})

updateOption.addEventListener('click', async (event)=> {
    SetOption();
    ShowInfo(JSON.stringify(JSON.parse(store['option']), null, 4));
})


defaultOption.addEventListener('click', async (event)=> {
    console.log('load default..', new Date());
    DefaultOption();
    ShowInfo(JSON.stringify(JSON.parse(store['option']), null, 4));
})

getToken.addEventListener('click',   (event)=> {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "username": "user1",
        "password": "user1"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };
        
    //console.log(requestOptions);
    fetch("http://localhost:3000/get-token", requestOptions)
        .then(response => response.json())
        .then(result => {
            store['token'] = result.token;
            token.value = store['token'];
            ShowStatus(JSON.stringify(result, null, 4))
        })
        .catch(error => ShowStatus(JSON.stringify(error, null, 4)));
});

getOtp.addEventListener('click', (event) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "passcode": "12345678",
        "token": store['token']
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch("http://localhost:3000/get-otp", requestOptions)
        .then(response => response.json())
        .then(result => {
            store['otp'] = result.otp;
            otp.value = store['otp'];
            ShowStatus(JSON.stringify(result, null, 4))
        })
        .catch(error => ShowStatus(JSON.stringify(error, null, 4)));
});

eSign.addEventListener('click', async (event)=> {
    
   var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = store['option'];
    console.log(raw)
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch("http://localhost:3000/e-sign", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.result && result.data.result.status === 'Success') {
                store['result'] = result.data.result.file_data;
                showResult.src = renderPdfWithBase64(store['result'] || '');
            }
            console.log(result)
        })
        .catch(error => ShowStatus(JSON.stringify(error, null, 4)));
});

const DefaultOption = () => {
    let data = {
        "token": `${store['token'] || ''}`,
        "otp_code": `${store['otp'] || ''}`,
        "options": {
        "PAGENO": 1,
        "POSITIONIDENTIFIER": "Giám đốc bệnh viện",
        "RECTANGLESIZE": "350,60",
        "RECTANGLEOFFSET": "-30,-120",

        "VISIBLESIGNATURE": true,
        "VISUALSTATUS": false,

        "SHOWSIGNERINFO": true,
        "SIGNERINFOPREFIX": "Ký số bởi:",

        "SHOWREASON": true,
        "SIGNREASONPREFIX": "Lý do:",
        "SIGNREASON": "Tôi đồng ý",

        "SHOWDATETIME": true,
        "DATETIMEFORMAT": "dd/MM/yyyy HH:mm:ss",
        "DATETIMEPREFIX": "Thời gian:",

        "SHOWLOCATION": true,
        "LOCATIONPREFIX": "Nơi ký:",
        "LOCATION": "Hồ Chí Minh",

        "TEXTDIRECTION": "BOTTOMTOTOP",
        "TEXTCOLOR": "blue",
        "IMAGEANDTEXT": true,
        "FONTSTYLE": "ARIAL",
        "FONTSIZE": 12,

        "BACKGROUNDIMAGE": printSign.checked ? `${base64Data(store['signature'])}` : ""
        },
        "file_data": `${base64Data(store['pdf'])}`  
    }
    store['option'] = JSON.stringify(data);
}

const LoadOption = () => {
    let data = JSON.parse(store['option']);
    data['token'] = store['token'] || '';
    data['otp_code'] = store['otp'] || '';
    data['options']['PAGENO'] = +store['PAGENO'] || 1;
    data['options']['POSITIONIDENTIFIER'] = store['POSITIONIDENTIFIER'] || '';
    data['options']['FONTSTYLE'] = store['FONTSTYLE'] || 'ARIAL';
    data['options']['FONTSIZE'] = +store['FONTSIZE'] || 12;
    data['options']['TEXTCOLOR'] = store['TEXTCOLOR'];
    data['options']['BACKGROUNDIMAGE'] =  printSign.checked ? `${base64Data(store['signature'])}` : "";
    data['file_data'] = `${base64Data(store['pdf'])}`;
    
    store['option'] = JSON.stringify(data);
    ShowInfo(JSON.stringify(data, null, 4));
}

const SetOption = () => {
    store['option'] = store['optionTmp'] || '';
    return store['option'];
}


(init = async (t) => {
    console.log('Init web...', t);
    username.value = store['username'] || 'huynhtanphat';
    password.value = store['password'] || 'huynhtanphat';

    token.value = store['token'] || 'Not exist token';
    otp.value = store['otp'] || 'Not exist otp';
    passcode.value = store['passcode'] || '12345678';
    pdf.src = store['pdf'] || '';
    signature.src = store['signature'];
    showResult.src = renderPdfWithBase64(store['result'] || '');
    ShowInfo(JSON.stringify(JSON.parse(store['option']), null, 4));

    pageNo.value = store['PAGENO'] || 1;
    positionIndentifier.value = store['POSITIONIDENTIFIER'] || 'Vị trí ký';
    fontStyle.value = store['FONTSTYLE'] || 'ARIAL';
    fontSize.value = store['FONTSIZE'] || 12;
    textColor.value =  store['TEXTCOLOR'] || 'red';
    printSign.checked = store['printSign'] === 'true';

})(new Date())