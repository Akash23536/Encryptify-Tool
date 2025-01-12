function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('digitalClock').textContent = timeString;
  }


  updateClock();
  setInterval(updateClock, 1000);



function performEncryption() {
    const input = document.getElementById('inputText').value;
    const encryptionType = document.getElementById('encryptionType').value;

    if (encryptionType === 'base64') {
        const encodedText = btoa(input);
        document.getElementById('resultText').innerText = encodedText;
        showMessage("Encrypted using Base64");
    } else if (encryptionType === 'binary') {
        const binaryText = input.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
        document.getElementById('resultText').innerText = binaryText;
        showMessage("Encrypted using Binary");
    } else if (encryptionType === 'hexadecimal') {
        const hexText = input.split('').map(char => {
            return char.charCodeAt(0).toString(16).padStart(2, '0');
        }).join(' ');
        document.getElementById('resultText').innerText = hexText;
        showMessage("Encrypted using Hexadecimal");
    } else {
        showMessage('Unsupported encryption type!', true);
    }
}

function performDecryption() {
    const input = document.getElementById('inputText').value;
    const encryptionType = document.getElementById('encryptionType').value;

    try {
        if (encryptionType === 'base64') {
            const decodedText = atob(input);
            document.getElementById('resultText').innerText = decodedText;
            showMessage("Decrypted from Base64");
        } else if (encryptionType === 'binary') {
            const plainText = input.split(' ').map(binaryChar => {
                return String.fromCharCode(parseInt(binaryChar, 2));
            }).join('');
            document.getElementById('resultText').innerText = plainText;
            showMessage("Decrypted from Binary");
        } else if (encryptionType === 'hexadecimal') {
            const plainText = input.split(' ').map(hexChar => {
                return String.fromCharCode(parseInt(hexChar, 16));
            }).join('');
            document.getElementById('resultText').innerText = plainText;
            showMessage("Decrypted from Hexadecimal");
        } else {
            showMessage("Unsupported decryption type!", true);
        }
    } catch (error) {
        showMessage('Decryption failed! Invalid input.', true);
    }
}






function copyToClipboard() {
    const resultText = document.getElementById('resultText').innerText;
    navigator.clipboard.writeText(resultText).then(() => {
        showMessage("Copied to clipboard!");
    }).catch(err => {
        showMessage("Failed to copy: " + err, true);
    });
}

function pasteFromClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById('inputText').value = text;
            showMessage('Pasted from clipboard');
        })
        .catch(err => {
            showMessage('Failed to paste: ' + err, true);
        });
}

function refreshData() {
    document.getElementById('inputText').value = '';
    document.getElementById('resultText').innerText = '';
    document.getElementById('qrcode').innerHTML = ''; 
    document.getElementById('barcode').innerHTML = ''; 
    document.getElementById('encryptionType').selectedIndex = 0;
    showMessage("Data refreshed!");
}

function toggleDarkMode() {
    // Toggle the dark mode class for body and relevant elements
    document.body.classList.toggle('dark-mode');
    document.querySelector('.form-container').classList.toggle('dark-mode');
    document.querySelector('.result-box').classList.toggle('dark-mode');

    // Optionally, toggle the button style itself (e.g., change icon or button color)
    const toggleButton = document.querySelector('.btn-outline-dark');
    toggleButton.classList.toggle('dark-mode');

    // Show a message (optional)
    showMessage("Dark Mode toggled!");
}



function showMessage(message, isError = false) {
    // Get the message container element
    const messageElement = document.getElementById('message');

    // Display the message container
    messageElement.style.display = 'inline-block';

    // Set the color based on the isError flag (red for error, green for success)
    messageElement.style.color = isError ? 'red' : 'green';

    // Set the text of the message
    messageElement.textContent = message;

    // Automatically hide the message after 3 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}



function generateQRCode() {
    const resultText = document.getElementById('resultText').innerText;
    if (!resultText) return showMessage('No result to generate QR Code.',true);

    QRCode.toString(resultText, { type: 'svg' }, (err, svg) => {
        if (err) return showMessage('Failed to generate QR Code.',true);
        document.getElementById('qrcode').innerHTML = svg;
    });
}

function generateBarcode() {
    const resultText = document.getElementById('resultText').innerText;
    if (!resultText) return showMessage('No result to generate Barcode.',true);

    const canvas = document.getElementById('barcodeCanvas');
    try {
        bwipjs.toCanvas(canvas, {
            bcid: 'code128',     // Barcode type
            text: resultText,    // Text to encode
            scale: 3,            // 3x scaling factor
            height: 10,          // Bar height, in millimeters
            includetext: true,   // Show human-readable text
            textxalign: 'center' // Align text to the center
        });
    } catch (err) {
        showMessage('Failed to generate Barcode: ' + err.message,true);
    }
}


function shareContent() {
    const inputText = document.getElementById('inputText').value;
    const resultText = document.getElementById('resultText').innerText;

    const qrCodeImage = document.querySelector('#qrcode img');
    const barcodeCanvas = document.querySelector('#barcodeCanvas');

    let shareText = `Input Text: ${inputText}\n\nResult: ${resultText}\n\n`;

    if (qrCodeImage) {
        shareText += `QR Code: ${qrCodeImage.src}\n\n`;
    }

    if (barcodeCanvas) {
        const barcodeDataUrl = barcodeCanvas.toDataURL(); // Get barcode as a Data URL
        shareText += `Barcode: ${barcodeDataUrl}\n\n`;
    }

    if (navigator.share) {
        navigator.share({
            title: 'Encryptify Result',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showMessage("Content shared successfully!");
        }).catch((err) => {
            showMessage("Failed to share: " + err, true);
        });
    } else {
        showMessage("Sharing not supported on this device", true);
    }
}


