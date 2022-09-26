import prisma from "@/lib/prisma";
import { Session, unstable_getServerSession } from "next-auth";
import Joi from "joi";
import { authOptions } from "../auth/[...nextauth]";
import { contractType } from "@/components/table/config_Contracts";
import { abiType } from "@/components/table/config_ABI";

function IDConverter(object: string, id: string) {
  switch (object) {
    case "contract":
      return id;
    default:
      return Number(id);
  }
}

const accessRules = {
  contract: {
    GET: (session: Session) => true,
    POST: (session: Session) => !!session,
    PUT: (session: Session) => !!session,
    DELETE: (session: Session) => !!session,
  },
  user: {
    GET: (session: Session) => !!session,
    POST: (session: Session) => !!session,
    PUT: (session: Session) => !!session,
    DELETE: (session: Session) => !!session,
  },
  network: {
    GET: (session: Session) => true,
    POST: (session: Session) => !!session,
    PUT: (session: Session) => !!session,
    DELETE: (session: Session) => !!session,
  },
  abi: {
    GET: (session: Session) => true,
    POST: (session: Session) => !!session,
    PUT: (session: Session) => !!session,
    DELETE: (session: Session) => !!session,
  },
  program: {
    GET: (session: Session) => true,
    POST: (session: Session) => !!session,
    PUT: (session: Session) => !!session,
    DELETE: (session: Session) => !!session,
  },
};

const validator = {
  contract: {
    POST: Joi.object<contractType>({
      id: Joi.string().pattern(new RegExp("^(0x)?[a-fA-F0-9]{40}$")),
      name: Joi.string().required(),
      Network: Joi.required(),
      Abi: Joi.required(),
    }),
  },
  abi: {
    POST: Joi.object<abiType>({
      name: Joi.string().required(),
      abi: Joi.string()
        .required()
        .custom((value, helpers) => {
          try {
            JSON.parse(value);
            return value;
          } catch (err) {
            return helpers.error("any.invalid");
          }
        }, "ABI Object not a valid JSON format"),
    }),
  },
};

export default async function handle(req, res) {
  const crudCommands = req.query.crud;
  const query = req.query.q || "{}";
  const method = req.method;
  const session = await unstable_getServerSession(req, res, authOptions);

  res.setHeader("Cache-Control", "s-maxage=180");

  const object = crudCommands[0];
  const id = crudCommands[1];

  if (Object.keys(prisma).indexOf(object) === -1 || !accessRules[object]) {
    return res.status(404).send({ error: "Not found" });
  }

  if (!accessRules[object][method](session)) {
    return res.send({
      error: "You must be sign to proceed.",
    });
  }

  if (validator[object] && validator[object][method]) {
    console.log(req.body);
    const { error, value } = validator[object][method].validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    console.log(value);
  }

  try {
    switch (method) {
      case "GET": {
        if (id) {
          const result = await prisma[object].findFirst({
            where: {
              id: IDConverter(object, id),
            },
            ...JSON.parse(query),
          });
          res.json(result);
        } else {
          const _q = {
            ...JSON.parse(query),
          };
          const DONT_FILTER = ["network"];
          if (DONT_FILTER.indexOf(object) === -1) {
            _q.where = _q.where || {};
            _q.where.OR = [
              { public: true },
              {
                Owner: {
                  email: session.user.email,
                },
              },
            ];
          }
          const result = await prisma[object].findMany({
            ..._q,
          });
          res.json(result);
        }
        break;
      }
      case "POST": {
        const result = await prisma[object].create({
          data: {
            ...req.body,
            Owner: {
              connectOrCreate: {
                create: {
                  email: session.user.email,
                  name: session.user.name,
                },
                where: {
                  email: session.user.email,
                },
              },
            },
          },
        });
        res.json(result);
        break;
      }
      case "PUT": {
        const item = await prisma[object].findFirst({
          where: {
            id: IDConverter(object, id),
            Owner: {
              email: session.user.email,
            },
          },
        });
        const result = await prisma[object].update({
          where: {
            id: item.id,
          },
          data: {
            ...req.body,
            Owner: {
              connectOrCreate: {
                create: {
                  email: session.user.email,
                  name: session.user.name,
                },
                where: {
                  email: session.user.email,
                },
              },
            },
          },
        });
        res.json(result);
        break;
      }
      case "DELETE": {
        const item = await prisma[object].findFirst({
          where: {
            id: IDConverter(object, id),
            Owner: {
              email: session.user.email,
            },
          },
        });
        const result = await prisma[object].delete({
          where: {
            id: item.id,
          },
        });
        res.json(result);
        break;
      }
      default: {
        res.status(500).json({
          error: "Method not supported",
        });
        break;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
}
