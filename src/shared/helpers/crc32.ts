export class Crc32 {
  crc: number;

  constructor() {
    this.crc = -1;
  }

  update(data: Uint8Array) {
    for (let byte of data) {
      let code = (this.crc ^ byte) & 0xff;
      for (let j = 0; j < 8; j++) {
        code = (code & 1) ? (0xEDB88320 ^ (code >>> 1)) : (code >>> 1);
      }
      this.crc = (this.crc >>> 8) ^ code;
    }
  }

  digest() {
    return (this.crc ^ -1) >>> 0;
  }
}
