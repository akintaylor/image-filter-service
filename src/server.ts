import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import * as fs from "fs";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url }: { image_url: string } = req.query;

    const image_path: string = await filterImageFromURL(image_url);

    res.sendFile(image_path, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }

      fs.readdir("./src/util/tmp", async (err, files) => {
        if (err) {
          return console.error(err);
        }

        const full_file_paths = files.map(
          (file) => __dirname + "/util//tmp/" + file
        );

        await deleteLocalFiles(full_file_paths);
      });
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
