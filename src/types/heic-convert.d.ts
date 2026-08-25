declare module "heic-convert" {
  function convert(options: {
    buffer: Buffer | Uint8Array | ArrayBuffer;
    format: "JPEG" | "PNG";
    quality?: number;
  }): Promise<ArrayBuffer>;

  export default convert;
}
