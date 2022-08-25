import prisma from "@/lib/prisma";

export default async (req, res) => {
  let data = await prisma.abi.findFirst({
    where: {
      id: Number(req.query.id),
    },
  });
  return res.json(data);
};
