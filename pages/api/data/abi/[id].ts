import prisma from "@/lib/prisma";

export default async (req, res) => {
  let data = await prisma.abi.findFirst({
    where: {
      id: Number(req.query.id),
    },
  });
  res.setHeader("Cache-Control", "s-maxage=180");
  return res.json(data);
};
