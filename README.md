
# Node ZPL Printer

This repository is adjusted to support printing using ZPL language 
(Tested with Zebra printer: [ZD230](https://www.pospak.com/th/zebra-zd230))

Thanks to original library [@thiagoelg/node-printer](https://github.com/thiagoelg/node-printer)

If you have a problem, ask or find/create a new [Github issue](https://github.com/npr-digital-partner/zpl-printer-new/issues)
___

### Purpose:
I need to find a solution that allow web application to manage and print barcode labels for WMS. I can't find solution that connect web app to barcode printer, so I decide to create this to serve the purpose.

### Features:
* NodeJS application to receive payload from web application and send to printer
* For testing use: `http://localhost:4000/test`

* For printing use: `http://localhost:4000/print` (see example below)

* Compatible with window only!


### How to install:

```
# Download this project

# Install all dependencies using
npm install

# Run application and select printer
node app.js
```

  

### How to use:

* Connect printers to computer and install printer driver
> For Zebra printer [ZebraDesigner.rar](https://drive.google.com/file/d/1AA174_7RpEhwDjFfyvU6OfiowU-H4Ybm/view?usp=share_link)

* Config printing template in template.zpl file (Example here: example-template.zpl)

* To design label you can use [ZPL Viewer](http://labelary.com/viewer.html)

* You can now use the service by posting to following
> For testing POST to: http://localhost:4000/test
> For printing POST to: http://localhost:4000/print with following example payload
```
[
	{
		"productId": "P001",
		"productName": "ABC",
		"productSn": "SN000001",
		"productLot": "09/05/2023",
		"productQty": "300",
		"productUom": "Unit",
		"productBarcode": "P001#LOT09052023#SN000001#300",
	},
	{
		"productId": "P002",
		"productName": "DEF",
		"productSn": "SN000002",
		"productLot": "09/05/2023",
		"productQty": "99",
		"productUom": "Unit",
		"productBarcode": "P002#LOT09052023#SN000002#99",
	},
]
```
---
### Author(s):

* Suppakit Krasettrakarn, suppakit@npr.digital

* NPR Digital Partner (https://npr.digital)


### License:

[The MIT License (MIT)](http://opensource.org/licenses/MIT)