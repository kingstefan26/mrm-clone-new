export const rpId = 'localhost';
export const rpOrgin = `http://${rpId}:5173`;
export const rpName = 'Mrm Clone';

export const uint8ArrayToBase64 = (uint8Array) => Buffer.from(uint8Array).toString('base64');

export const base64ToUint8Array = (base64) => new Uint8Array(Buffer.from(base64, 'base64'));
