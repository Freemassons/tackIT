const hashString = 'ZUVvShFSES21qHsQEqZXMxQ9zgHy';

function encryptString(data) {
    let encryptedPW = CryptoJS.AES.encrypt(JSON.stringify(data), hashString,
    {
       keySize: 128 / 8,
       iv: hashString,
       mode: CryptoJS.mode.CBC,
       padding: CryptoJS.pad.Pkcs7
     }).toString();

    return encryptedPW;
}

function decryptString(data) {
    let decryptedPW = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(data, hashString,
    {
       keySize: 128 / 8,
       iv: hashString,
       mode: CryptoJS.mode.CBC,
       padding: CryptoJS.pad.Pkcs7
    })));

    return decryptedPW;
}