import EncryptedStorage from 'react-native-encrypted-storage';

export default class Storage {
  constructor() {}
  async getKey(key: string) {
    return await EncryptedStorage.getItem(key);
  }
  async setKey(key: string, value: string) {
    return await EncryptedStorage.setItem(key, value);
  }
  async deleteKey(key: string) {
    return await EncryptedStorage.removeItem(key);
  }
}
