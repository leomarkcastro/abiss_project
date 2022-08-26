import prisma from "@/lib/prisma";

export default async (req, res) => {
  let data = await prisma.contract.findFirst({
    where: {
      id: req.query.id,
    },
    include: {
      abi: true,
      network: true,
    },
  });
  res.setHeader("Cache-Control", "s-maxage=180");
  return res.send(data);
};
