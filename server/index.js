const express = require('express');
const bodyParser = require('body-parser');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { customAlphabet } = require('nanoid');
const QRCode = require('qrcode');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

//Generating Id
// Define the character set (uppercase letters and digits)
const generateShortId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 7);
const bookingId = generateShortId();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Define the endpoint
app.post('/generate-ticket', async (req, res) => {
  const { experienceName, date, numberOfPersons, customerName } = req.body;
  // Create a canvas for the ticket
  const canvas = createCanvas(300, 500);
  const ctx = canvas.getContext('2d');

  // Set background color
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // Load fonts and image (replace paths as needed)
  const logo = await loadImage('public/logo.png');
  const poster = await loadImage('public/poster.png');
  const contentWidth = canvas.width - 20;
  const leftMargin = 10;
  const borderWidth = .8;
  const borderColor = "#D3D3D3";
  const lightBg = "#F1F1F1"

  //header
  ctx.fillStyle = "#3E3E3E"
  ctx.font = "10px Arial"
  ctx.fillText("Booking ID", 20, 20);
  ctx.font = "12px Arial"
  ctx.fillStyle = "white"
  ctx.fillText(bookingId, 80, 20);

  // Draw poster image
  const posterHeight = 100;
  ctx.drawImage(poster, leftMargin, 30, contentWidth, posterHeight);


  /*------------------------------------------------------ Experience Name   ---------------------------------------------------*/
  const boxHeight = 40;
  const rectY = 30 + posterHeight;
  ctx.fillStyle = lightBg;
  ctx.fillRect(leftMargin, rectY, contentWidth, boxHeight);

  // Draw black text vertically centered inside the rectangle
  const text = experienceName;
  ctx.fillStyle = 'black';
  ctx.font = '15px Arial';
  const textX = 2 * leftMargin;
  const textY = rectY + 25;
  ctx.fillText(text, textX, textY);

  // Draw gray border at the bottom

  ctx.fillStyle = borderColor;
  ctx.fillRect(leftMargin, rectY + boxHeight - borderWidth, contentWidth, borderWidth);



  /*--------------------------------------   Date Box   -------------------------------------------------*/
  const dateBoxY = rectY + boxHeight;
  ctx.fillStyle = lightBg;
  ctx.fillRect(leftMargin, dateBoxY, contentWidth, boxHeight);

  // Draw black text for Date label
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  const dateLabel = 'Date';
  const dateLabelX = 2 * leftMargin;
  const dateLabelY = dateBoxY + 10;
  ctx.fillText(dateLabel, dateLabelX, dateLabelY);

  // Draw black text for formatted Date value
  const dateObject = new Date(date); // Assuming 'date' is a valid date string
  const formattedDate = dateObject.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  ctx.font = '15px Arial';
  const dateValueX = 2 * leftMargin;
  const dateValueY = dateBoxY + 28;
  ctx.fillText(formattedDate, dateValueX, dateValueY);

  // Draw gray border at the bottom of Date section
  ctx.fillStyle = borderColor;
  ctx.fillRect(leftMargin, dateBoxY + boxHeight - borderWidth, contentWidth, borderWidth);


  /*-----------------------------------------   Name and Count Box   --------------------------------------------*/
  const nameBox = dateBoxY + boxHeight;
  ctx.fillStyle = lightBg;
  ctx.fillRect(leftMargin, nameBox, contentWidth, boxHeight * 2);

  // Name Text
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.fillText("Name", 2 * leftMargin, nameBox + 20);
  ctx.font = '15px Arial';
  ctx.fillText(customerName, 2 * leftMargin, nameBox + 40);

  //Count text
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.fillText("Persons", 200, nameBox + 20);
  ctx.font = '15px Arial';
  ctx.fillText(numberOfPersons, 200, nameBox + 40);

  // Draw gray border at the bottom of Additional Box section
  ctx.fillStyle = borderColor;
  ctx.fillRect(leftMargin, nameBox + 2 * boxHeight - borderWidth, contentWidth, borderWidth);



  /*-------------------------------------------------------------    QR Code Box   ----------------------------------------*/
  const qrCodeBoxY = nameBox + 2 * boxHeight;
  ctx.fillStyle = 'white';
  ctx.fillRect(leftMargin, qrCodeBoxY, contentWidth, boxHeight * 4);

  // Generate QR code with bookingId
  const qrCodeData = bookingId;
  const qrCodeOptions = {
    width: 100,
    color: {
      dark: '#000', // QR Code color
      light: '#FFF' // Background color
    }
  };

  try {
    // Create a new canvas for QR code
    const qrCodeCanvas = createCanvas(100, 100);
    const qrCodeCtx = qrCodeCanvas.getContext('2d');
    const qrCodeImage = await QRCode.toCanvas(qrCodeCanvas, qrCodeData, qrCodeOptions);

    // Draw the QR code onto the main canvas
    ctx.drawImage(qrCodeImage, leftMargin + 100, qrCodeBoxY + 10, 75, 75);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }

  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.fillText(bookingId, leftMargin + 118, qrCodeBoxY + 95);


  // Draw gray border at the bottom of QR Code Box section
  ctx.fillStyle = borderColor;
  ctx.fillRect(leftMargin, qrCodeBoxY + 3 * boxHeight - borderWidth, contentWidth, borderWidth);

  // Draw small black half-circle cut in the middle
  const halfCircleRadius = 10;
  ctx.beginPath();
  ctx.arc(10, nameBox + 2 * boxHeight, halfCircleRadius, 0, Math.PI * 2, false);
  ctx.arc(contentWidth + leftMargin, nameBox + 2 * boxHeight, halfCircleRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'black';
  ctx.fill();

  /*-------------------------------------------------------------    Non Refundable  ----------------------------------------*/

  const refundY = qrCodeBoxY + boxHeight * 3;
  const cornerRadius = 20; // Adjust the corner radius as needed

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(leftMargin, refundY);
  ctx.lineTo(leftMargin + contentWidth, refundY);
  ctx.lineTo(leftMargin + contentWidth, refundY + boxHeight - cornerRadius);
  ctx.arcTo(leftMargin + contentWidth, refundY + boxHeight, leftMargin + contentWidth - cornerRadius, refundY + boxHeight, cornerRadius);
  ctx.lineTo(leftMargin + cornerRadius, refundY + boxHeight);
  ctx.arcTo(leftMargin, refundY + boxHeight, leftMargin, refundY + boxHeight - cornerRadius, cornerRadius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.fillText("This Ticket is non refundable", 2 * leftMargin, refundY + 20);


  /*------------------------------------------- Footer -----------------------------------------------------------*/
  ctx.drawImage(logo, 20, canvas.height - 50, 50, 50);
  ctx.fillStyle = '#79797A';
  ctx.font = '15px Arial';
  ctx.fillText('M-Ticket', 230, canvas.height - 20);


  /*------------------------------------------------------ Respond with the image file ---------------------*/


  // Save the canvas as an image file
  const fileName = `ticket_${bookingId}.png`;
  const out = fs.createWriteStream(fileName);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', () => {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(fileName, { root: '.' }, (err) => {
      // Delete the file after sending
      console.log(`Send Ticket ${fileName}`);
      fs.unlinkSync(fileName);
    });
  });
 


});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
