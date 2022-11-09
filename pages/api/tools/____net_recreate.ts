import prisma from "@/lib/prisma";

export default async function net_recreate(req, res) {
  const networkToCreate = [
    {
      id: 1,
      name: "Main Net",
    },
    {
      id: 4,
      name: "Rinkeby",
    },
    {
      id: 5,
      name: "Goerli",
    },
    {
      id: 56,
      name: "Binance",
    },
    {
      id: 61,
      name: "Classic",
    },
    {
      id: 137,
      name: "Polygon Main",
    },
    {
      id: 80001,
      name: "Polygon Test",
    },
  ];
  for (let network of networkToCreate) {
    try {
      await prisma.network.create({
        data: network,
      });
    } catch (err) {}
  }
  res.send("Done");
}
