import prisma from "@/lib/prisma";

export default async (req, res) => {
  let data = await prisma.program.findFirst({
    where: {
      id: Number(req.query.id),
    },
    include: {
      contract: {
        include: {
          abi: true,
          network: true,
        },
      },
    },
  });
  res.setHeader("Cache-Control", "s-maxage=180");
  return res.send(data);
};
