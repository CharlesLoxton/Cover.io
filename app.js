import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import multer from "multer";
import { callOpenAI } from './functions/callOpenAI.js';
import convertPDFToImage from './functions/convertPDFToImage.js';
import deleteFile from './functions/deleteFile.js';
import extractText from './functions/extractText.js';
import path from 'path';
import paypal from "paypal-rest-sdk";
import { v4 } from "uuid";
import pdf2pic from "pdf2pic";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/tmp');
    },
    filename: (req, file, cb) => {
      cb(null, `${v4()}${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

paypal.configure({
    'mode': process.env.PAYPAL_MODE,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
})

//Create express app
const app = express();

app.use((req, res, next) => {
    // Check if the request URL ends in "Create.html"
    if (req.originalUrl.endsWith('Create.html')) {
      // If the request URL ends in "Create.html", return a 404 Not Found response
      res.sendFile(path.join(process.cwd(), './public/index.html'));
    } else {
      // If the request URL does not end in "Create.html", allow the request to proceed to the next middleware or route handler
      next();
    }
  });

app.use(express.static('./public'));

app.get('/', (req, res) => {
    // Serve the "index.html" file at the "/" endpoint
    res.sendFile(path.join(process.cwd(), './public/index.html'));
  });

app.get('/Create', (req, res) => {

    if(req.query?.paymentId != null && req.query?.token != null && req.query?.PayerID != null){

        paypal.payment.get(req.query.paymentId, (error, payment) => {
            if (error) {
              console.error(error);
            } else {
              if (payment.state === 'approved') {
                console.log('Payment has been executed');
                res.sendFile(path.join(process.cwd(), './public/index.html'));
              } else {
                console.log('Payment has not been executed');
                paypal.payment.execute(req.query.paymentId, { payer_id: req.query.PayerID }, (error, payment) => {
                    if (error) {
                      console.error(error);
                    } else {
                      console.log('Payment executed successfully');
                    }
                });
                
                res.sendFile(path.join(process.cwd(), './public/Create.html'));
              }
            }
          });
    } else {
        res.sendFile(path.join(process.cwd(), './public/index.html'));
    }
});

app.get('/Privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), './public/Privacy.html'));
});

app.get('/Terms', (req, res) => {
    res.sendFile(path.join(process.cwd(), './public/Terms.html'));
});

app.get('/Checkout', (req, res) => {
    res.sendFile(path.join(process.cwd(), './public/Checkout.html'));
});

app.get('/Package', (req, res) => {
    res.sendFile(path.join(process.cwd(), './public/Package.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(process.cwd(), './public/Demo.html'));
});

app.post('/Pay', (req, res) => {
    
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": process.env.RETURN_URL,
            "cancel_url": process.env.CANCEL_URL
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Basic Plan",
                    "sku": "Cover Letter",
                    "price": "0.99",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "0.99"
            },
            "description": "AI-Cover Basic Plan. 1 Cover Letter"
        }]
    };

    paypal.payment.create(create_payment_json, function(error, payment){
        if(error){
            console.log(error);
        } else {
            res.send({links: payment.links})
        }
    })
})

app.post('/upload', upload.single('avatar'), async (req, res) => {

    try{
        const newFileName = req.file.filename.replace('.pdf', '');
        await convertPDFToImage(`/tmp/${req.file.filename}`, `/tmp/${newFileName}`);

        let text = await extractText(`/tmp/${newFileName}-1.png`);

        deleteFile(`/tmp/${newFileName}-1.png`);
        deleteFile(`/tmp/${req.file.filename}`);

        var str = text.ParsedResults[0].ParsedText;

        let result = await callOpenAI(str);

        res.send(result);
    }
    catch(err){
        console.log(err);
    }
});

app.post('/uploaddemo', upload.single('avatar'), async (req, res) => {

    try{
        const newFileName = req.file.filename.replace('.pdf', '');
        //await convertPDFToImage(`/tmp/${req.file.filename}`, `${newFileName}.png`);

        //Problem lies with converting pdf to png, takes too long

        const options = {
          density: 100,
          savename: `${newFileName}.png`,
          savedir: "/tmp",
          format: "png"
        };
        
        pdf2pic.convertPdf2Pic(inputPath, options)
        .then((resolve) => {
              console.log("image converted successfully");
              res.sendFile(`/tmp/${newFileName}.png`, { root: '/' }, err => {
                if (err) {
                  console.error(err);
                  res.sendStatus(500);
                }
              });
        }).catch((error) => {
              console.log("Error during conversion: " + error);
        });
        
        //res.send(str);
    }
    catch(err){
        console.log(err);
    }
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

  
