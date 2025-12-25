import { sha256 } from "js-sha256"; // Import the sha256 function

export class Checksum {
  static fromBuffer(content: ArrayBuffer): string {
    return sha256(new Uint8Array(content));
  }

  static fromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(sha256(new Uint8Array(reader.result)));
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsArrayBuffer(file);
    });
  }
}
