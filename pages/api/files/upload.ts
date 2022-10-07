import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import { SHA3 } from "sha3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadIndex(req, res) {
  const uploadPath = `${__dirname}/../../../../public/uploads/static`;

  try {
    await stat(uploadPath);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadPath, { recursive: true });
    } else {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  const form = formidable({
    multiples: true,
    uploadDir: uploadPath,
    keepExtensions: true,
    filename: function (name, ext, part, form) {
      const hash = new SHA3(256);
      const current = new Date();
      hash.update(`${current.getTime().toString()}-${name}`);
      return hash.digest("hex") + ext;
    },
  });
  form.parse(req, (err, fields, files) => {
    // console.log(fields, files);
    if (err) {
      res.status(500).json({ error: err });
      return;
    } else {
      const urls = {};
      for (const i in files.file) {
        const fileLocation = files.file[i].filepath.split("uploads\\static")[1];
        urls[i] = `http://localhost:3000/uploads/static${fileLocation.replace(
          "\\",
          "/"
        )}`;
      }
      res.status(200).json({ fields, files, urls });
    }
  });
}
