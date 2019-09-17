import CryptoJS from 'crypto-js';
import SecureStorage from 'secure-web-storage';

const SECRET_KEY = 'Store Story Immanent';

const secureStorage = new SecureStorage(localStorage, {
    hash: (key) => {
        key = CryptoJS.SHA256(key, SECRET_KEY);

        return key.toString();
    },
    encrypt: (data) => {
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);

        data = data.toString();

        return data;
    },
    decrypt: (data) => {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);

        data = data.toString(CryptoJS.enc.Utf8);

        return data;
    }
});

export default secureStorage;
