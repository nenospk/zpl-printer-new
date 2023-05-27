const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const printer = require("./lib");
const fs = require('fs');
var List = require('prompt-list');
const { prompt } = require('enquirer');

const app = express();
app.use(bodyParser.json());

// Default printer name will be selected below by prompt list
let printerName = "ZDesigner ZD230-203dpi ZPL";
let template = "";

// Set up CORS Middleware and logging
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header( 
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, x-access-token, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, HEAD"
  );
  console.log(req.method, req.originalUrl);
  next();
});

const formatData = (data) => {
    let formattedData = [];
    for (var i = 0; i < data.length; i++) {
        let item = data[i];
        let formattedObj = {
            //productId: "รหัสสินค้า",
            productId: item.productId === undefined || item.productId === "" ? "-" : item.productId,
            //productName: "ชื่อสินค้า",
            productName: item.productName === undefined || item.productName === "" ? "-" : item.productName,
            //productSn: "SN",
            productSn: item.productSn === undefined || item.productSn === "" ? "-" : item.productSn,
            //productLot: "Lot",
            productLot: item.productLot === undefined || item.productLot === "" ? "-" : item.productLot,
            //productBarcode: "Barcode",
            productBarcode: item.productBarcode === undefined || item.productBarcode === "" ? "-" : item.productBarcode,
            //productQty: "Qty",
            productQty: item.productQty === undefined || item.productQty === "" ? "-" : item.productQty,
            //productUom: "uom"
            productUom: item.productUom === undefined || item.productUom === "" ? "-" : item.productUom,
        }
        formattedData.push(formattedObj)
    }
    // console.log(formattedData)
    return formattedData
}

const mapData = (template, data) => {
    template = template.replace(/_import_date_/g, data.import_date);
    template = template.replace(/_product_id_/g, data.product_id);
    template = template.replace(/_description_/g, data.description);
    template = template.replace(/_packing_list_/g, data.packing_list);
    template = template.replace(/_model_/g, data.model);
    template = template.replace(/_color_/g, data.color);
    template = template.replace(/_surface_/g, data.surface);
    template = template.replace(/_width_/g, data.width);
    template = template.replace(/_thick_/g, data.thick);
    template = template.replace(/_length_/g, data.length);
    template = template.replace(/_qty_per_pack_/g, data.qty_per_pack);
    template = template.replace(/_qty_/g, data.qty);
    template = template.replace(/_serial_number_/g, data.serial_number);
    // console.log(mapData)
    return template;
}

const printRaw = (printerName, data) => {
    const setUp = {
        data: data, 
        printer: printerName, 
        type: 'RAW', 
        success: function(jobID){
            console.log("sent to printer with ID: " + jobID);
            console.log(data);
            console.log("--------------------------------");
            
        }, 
        error:function(err){console.log(err);}
    }
    printer.printDirect(setUp);
    return setUp
}

app.post("/test", (req, res) => {
    printer.printDirect(
        {data: template
        , printer: printerName
        , type: 'RAW'
        , success:function(jobID){
            console.log("sent to printer with ID: "+jobID);
        }
        , error:function(err){console.log(err);}
    });

    res.send("Test successfully");
});
  
app.post("/print", (req, res) => {
    console.log("---------------- START PRINTING ----------------");
    // Mapping template
    const data = req.body;
    if(!data) {
        res.status(201).json({ status: "error", message: "data  is required" });
    }
    // console.log(req.body);
    // console.log(data)

    // Format data
    const formattedData = formatData(data);
    
    // Mapping template and Print
    let result = [];
    for (var i = 0; i < data.length; i++) {
        const mappedData = mapData(template, data[i])
        const printData = printRaw(printerName, mappedData);
        result.push(printData)
    }
    console.log("---------------- END PRINTING ----------------");

    // Return
    res.status(201).json({ status: "success", data: formattedData, result: result });
});

app.get("/", (req, res) => {
    res.send("Printer service is running");
});

const question = [
    {
        type: 'password',
        name: 'license',
        message: 'Please enter license code'
    }
];

console.log("📌 To get license please contact:");
console.log("> Website: www.npr.digital");
console.log("> Email: contact@npr.digital");
console.log("-------------------------------------------------------------------------------------");
prompt(question)
.then(input => {
    // Validate license
    console.log("Validating license....")
    if(input.license != "dc306362-2fae-45ad-bfce-4d80dc5339fa") {
        console.log("🚫 License is not valid. Please try again.")
        return false
    } else {
        console.log("✅ License is valid.")
        // Select printer before running service
        util = require('util');
        let list = new List({
            name: 'printer',
            message: 'Please select a printer...',
            choices: printer.getPrinters()
        });
        list.run()
        .then(function(answer) {
            if(!answer) {
                console.log("❌ Please select a printer");
                return false
            }
             // Select printer
            printerName = answer;

            // Get template from template.zpl
            try {
                let data = fs.readFileSync('./template.zpl', 'utf8');
                template = data;
                // console.log("data", data)
            } catch (err) {
                console.log("❌ Can't read template (template.zpl)");
                return false;
                // console.log(err);
            }

            if(!template || template == "") {
                console.log("❌ Template is empty. Please setup at template.zpl");
                return false;
            }

            // Run application
            const port = 4000;
            app.listen(port, () => {
                console.log("-------------------------------------------------------------------------------------");
                console.log(" ");
                console.log(`🔥 Printer service is running on port ${port} 🔥`);
                console.log(" ");
                console.log("-------------------------------------------------------------------------------------");
                console.log("📌 You can now use the service by posting to following");
                console.log("> For testing use: http://localhost:4000/test");
                console.log("> For printing use: http://localhost:4000/print");
                console.log("-------------------------------------------------------------------------------------");
                //console.log("📌 You can config printing template in template.zpl file and restart application (Example here: example-template.zpl)");
                console.log("❔ Other guidelines go visit: https://github.com/npr-digital-partner/zpl-printer-new");
                console.log("-------------------------------------------------------------------------------------");
            });
            return false;
        });
    }
});
