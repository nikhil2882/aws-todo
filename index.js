var mysql      = require('mysql');
const AWS = require('aws-sdk');

const multer = require("multer");
const multerS3 = require("multer-s3");

var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database : ''
});
 
// Enter copied or downloaded access ID and secret key here
const ID = '';
const SECRET = '';

// The name of the bucket that you have created
const BUCKET_NAME = '';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleUpload = upload.single("todo_image");

connection.connect(function()
{
  console.log("db is live")
});

var express = require("express");

var app = express();

app.listen(3000, function()
{
  console.log("server is live")
})

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/todo", function(req, res)
{
  const sql = `select * from todo;`

  connection.query(sql, function(err, result)
  {
    if(err)
    {
      res.json({ status: false, data:[] });
    }
    else
    {
      res.json({ status: true, data:result });
    }
  })
})

app.post("/todo", function(req, res)
{
  singleUpload(req, res, function (err) {
    if (err) {
      console.log(err)
      return res.json({
        success: false
      });
    }

    const body = req.body;

    console.log(body)


    let image_URL = req.file.location;

    const sql = `INSERT INTO todo (text, url)
    VALUES ('${body.text}','${image_URL}');`

    connection.query(sql, function (err, result) {
      if (err)
      {
        console.log(err)
        res.json({ status: false })
      }
      else
      {
        console.log("1 record inserted");
        res.json({status: true});
      }
    });

  });


})
