import keythereum from "keythereum";

export default async function restricted(req, res) {
  try {
    const body = JSON.parse(req.body);

    const { password, keyObject } = body;

    const _keyObject = keyObject;

    // console.log(body);

    let privateKey = keythereum.recover(password || "pass123", _keyObject);

    // const session = await unstable_getServerSession(req, res, authOptions);
    res.send(
      JSON.stringify(
        {
          recoveredPK: privateKey.toString("hex"),
        },
        null,
        2
      )
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
}
