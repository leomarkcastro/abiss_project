import prisma from "@/lib/prisma";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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

export default async function handle(req, res) {
  const crudCommands = req.query.crud;
  const query = req.query.q || "{}";
  const method = req.method;
  const session = await unstable_getServerSession(req, res, authOptions);

  // console.log(method, crudCommands, session);

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
        const result = await prisma[object].findMany({
          ...JSON.parse(query),
        });
        res.json(result);
      }
      break;
    }
    case "POST": {
      const result = await prisma[object].create({
        data: {
          ...req.body,
          User: {
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
          id: IDConverter(object, id) as string,
          User: {
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
          User: {
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
      const result = await prisma[object].delete({
        where: {
          id: IDConverter(object, id),
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
}
