const request = require("request");
const fs = require("fs");

binary_input =fs.createReadStream('test/sample-input.png');


var formData = {
  file: binary_input,
};

request.post(
  {
    headers: {
      "Content-Type": "multipart/form-data",
      connection: "keep-alive",
    },
    url: "http://localhost:8000/predict",
    formData: formData,
  },
  function (err, res, body) {
    console.log(body);
    fs.writeFileSync("test/sample-output.png", Buffer.from(body), (err) => {
      if (err) throw err;
      console.log(body)
      console.log("File saved!");
    });
  }
);
