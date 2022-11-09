import CryptoJS from "crypto-js";
import prisma from "@/lib/prisma";
import Joi from "joi";

export default async function handle(req, res) {
  const cuid = req.query.cuid;
  const method = req.method;

  const key = req.query.key || false;

  // const body = req.body;

  res.setHeader("Cache-Control", "s-maxage=180");

  switch (method) {
    case "GET":
      // create database entry
      const secret = await prisma.secrets.findUnique({
        where: {
          id: cuid,
        },
      });

      let decrypted;
      let correct;
      let error;
      if (secret && key) {
        try {
          decrypted = CryptoJS.AES.decrypt(secret.value, key).toString(
            CryptoJS.enc.Utf8
          );
          const hash = CryptoJS.SHA256(decrypted).toString();
          correct = hash === secret.signature;
        } catch (err) {
          error = err.message;
        }
      }

      res
        .status(200)
        .json({ ...secret, decryptedValue: decrypted, correct, error });
      break;
    default:
      res.status(404).send({ error: "Not found" });
      break;
  }
}
