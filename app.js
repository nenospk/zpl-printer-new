const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const printer = require("./lib");

const app = express();
app.use(bodyParser.json());

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

const template = `
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD10^JUS^LRN^CI0^XZ
^XA
^MMT
^PW799
^LL0400
^LS0
^FO32,0^GFA,04608,04608,00012,:Z64:
eJzt2MENABAUA1DiKrGy0WyGA4c/Ank9vaSdoCn9nzZPenS9g8HMzMzMzMzM/LZzj79Hud7dAsveQQ0=:0691
^FO320,32^GFA,05760,05760,00036,:Z64:
eJztlLGKxCAQhidhhJQGtJd7EgNjr6DvY+lj7yS5vdtLDtNlt5hP1NiMP8MXAQRBeDP+YtwMXnF3IH/BzXE+rz/iTxfxp4/400f86SP+9NkkISBFC+8ByZP3cV2O/jj3BaMD2Ffn3Lb/AedcbNCLDUlFHFL2NOjTlVOtdZ38tR6grfuzwoYyhpMgz5INolWWgjn0Z3wtOR7O3wypLEBYlJ9B5yGlGdM5T6u1Ta3Vqe1hWvvNs1uC0XIdWsDraAmiKqrooz/PZjj3k+/UH224juY6Mc4EGpVSpzwchgPxqFtz2jSd+1NywZCDDZRN5tPaMnl/4BP/L3l/uog/fcSfPuJPH/Gnj/gj/MsDCkuLHg==:3036
^FT277,229^A0I,23,24^FH\^FDQty(Pcs.)^FS
^FT446,228^A0I,23,24^FH\^FDLength(mm.)^FS
^FT278,202^A0I,23,24^FH\^FD\_qty_\/\_qty_per_pack_\^FS
^FT599,228^A0I,23,24^FH\^FDThick(mm.)^FS
^FT364,293^A0I,23,24^FH\^FDSurface^FS
^FT666,26^A0I,17,16^FH\^FD\_serial_number_\^FS
^FT751,25^A0I,17,16^FH\^FDSERIAL NO.^FS
^FT446,201^A0I,23,24^FH\^FD\_length_\^FS
^FT751,227^A0I,23,24^FH\^FDWidth(mm.)^FS
^FT299,358^A0I,23,24^FH\^FDPacking List #^FS
^FT598,201^A0I,23,24^FH\^FD\_thick_\^FS
^FT580,293^A0I,23,24^FH\^FDColor^FS
^FT364,266^A0I,23,24^FH\^FD\_surface_\^FS
^FT751,199^A0I,23,24^FH\^FD\_width_\^FS
^FT298,331^A0I,23,24^FH\^FD\_packing_list_\^FS
^FT448,357^A0I,23,24^FH\^FDDescription^FS
^FT591,356^A0I,23,24^FH\^FDProduct ID^FS
^FT752,354^A0I,23,24^FH\^FDImport Date^FS
^FT580,266^A0I,23,24^FH\^FD\_color_\^FS
^FT448,330^A0I,23,24^FH\^FD\_description_\^FS
^FT591,329^A0I,23,24^FH\^FD\_product_id_\^FS
^FT752,292^A0I,23,24^FH\^FDModel^FS
^FT751,264^A0I,23,24^FH\^FD\_model_\^FS
^FT751,325^A0I,23,24^FH\^FD\_import_date_\^FS
^FT76,67^A0R,23,24^FB263,1,0,C^FH\^FDwww.biowoodthailand.com^FS
^FT48,67^A0R,23,24^FB263,1,0,C^FH\^FDTel. 0917370857^FS
^FO630,0^BY1,2.0,60^BQN,2,4^FDQA \_serial_number_\^FS
^PQ1,0,1,Y^XZ
`;
  
app.post("/zpl_print", (req, res) => {
    console.log("---------------- START PRINTING ----------------");
    // Check Printer
    // printerName = util.CheckPrinterName();
    // if(!printer) { return no printer }

    // Mapping template
    const printerName = "ZDesigner ZD230-203dpi ZPL";
    const data = req.body;
    if(!data) {
        res.status(201).json({ status: "error", message: "data  is required" });
    }
    console.log(req.body);
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
    res.send("ZPL Printer Service is running");
});

app.listen(4000, () => {
    console.log("Start server at port 4000.");
});