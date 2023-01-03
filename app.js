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

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage}).single('avatar');

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

app.post('/upload', (req, res) => {
    console.log(req.query);

    upload(req, res, async err => {

        const newFileName = req.file.originalname.replace('.pdf', '');
        await convertPDFToImage(`./uploads/${req.file.originalname}`, `./PDFimages/${newFileName}`);

        let text = await extractText(`./PDFimages/${newFileName}-1.png`);

        deleteFile(`./PDFimages/${newFileName}-1.png`);
        deleteFile(`./uploads/${req.file.originalname}`);

        var str = text.ParsedResults[0].ParsedText;

        res.send(await callOpenAI(str));
    })
});

app.post('/uploaddemo', (req, res) => {

    upload(req, res, async err => {

        const newFileName = req.file.originalname.replace('.pdf', '');
        await convertPDFToImage(`./uploads/${req.file.originalname}`, `./PDFimages/${newFileName}`);

        let text = await extractText(`./PDFimages/${newFileName}-1.png`);

        deleteFile(`./PDFimages/${newFileName}-1.png`);
        deleteFile(`./uploads/${req.file.originalname}`);

        var str = text.ParsedResults[0].ParsedText;

        let demo = await callOpenAI(str);

        demo = demo.substring(0, demo.length / 2);
        res.send(demo);
    })
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

  
