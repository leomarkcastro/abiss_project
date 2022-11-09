import prisma from "@/lib/prisma";
import Joi from "joi";

export default async function handle(req, res) {
  const cuid = req.query.cuid;
  const method = req.method;

  const body = req.body;

  res.setHeader("Cache-Control", "s-maxage=180");

  switch (method) {
    case "GET":
      // create database entry
      const secret = await prisma.secrets.findUnique({
        where: {
          id: cuid,
        },
      });

      res.status(200).json(secret);
      break;
    default:
      res.status(404).send({ error: "Not found" });
      break;
  }
}
