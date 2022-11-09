import prisma from "@/lib/prisma";
import Joi from "joi";

export default async function handle(req, res) {
  const query = req.query.q || "{}";
  const method = req.method;

  const body = req.body;

  res.setHeader("Cache-Control", "s-maxage=180");

  switch (method) {
    case "POST":
      // create secret
      const { value, signature } = body;

      const schema = Joi.object({
        value: Joi.string().required(),
        signature: Joi.string().required(),
      });

      // verify joi
      const { error, value: validated } = schema.validate(body);
      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      // create database entry
      const secret = await prisma.secrets.create({
        data: {
          value,
          signature,
        },
      });

      res.status(200).json(secret);
      break;
    default:
      res.status(404).send({ error: "Not found" });
      break;
  }
}
