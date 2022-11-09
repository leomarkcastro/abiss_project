import keythereum from "keythereum";

export default async function restricted(req, res) {
  const body = req.body;

  const { password } = body;

  // synchronous
  const dk = keythereum.create();

  const keyObject = keythereum.dump(
    password || "pass123",
    dk.privateKey,
    dk.salt,
    dk.iv
  );

  Object.keys(dk).forEach(function (key, index) {
    dk[key] = dk[key].toString("hex");
  });

  // const session = await unstable_getServerSession(req, res, authOptions);
  res.send(
    JSON.stringify(
      {
        raw: dk,
        keyObject,
      },
      null,
      2
    )
  );
}
