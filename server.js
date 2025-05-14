const express = require("express");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend

app.post("/submit", (req, res) => {
    console.log("Received Form Data:", req.body);

    const {
        sender_name, sender_phone, sender_address,
        recipient_name, recipient_phone, recipient_address,
        recipient_country, recipient_city, recipient_postal_code, recipient_address_intl,
        isInternational,
        package_type, package_weight, delivery_charges,
        delivery_speed, payment_status
    } = req.body;

    const isInternationalChecked = isInternational === 'on';

    const today = new Date().toISOString().split("T")[0];
    const folderPath = path.join(__dirname, "data", today);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const filePath = path.join(folderPath, "parcels.xlsx");
    let workbook, worksheet, data = [];

    if (fs.existsSync(filePath)) {
        const existingFile = XLSX.readFile(filePath);
        worksheet = existingFile.Sheets["Parcels"];
        data = XLSX.utils.sheet_to_json(worksheet);
    } else {
        workbook = XLSX.utils.book_new();
    }

    const parcelData = {
        SenderName: sender_name, 
        SenderPhone: sender_phone, 
        SenderAddress: sender_address,
        RecipientName: recipient_name, 
        RecipientPhone: recipient_phone,
        IsInternational: isInternationalChecked ? 'Yes' : 'No',
        PackageType: package_type, 
        PackageWeight: package_weight, 
        DeliveryCharges: delivery_charges,
        DeliverySpeed: delivery_speed, 
        PaymentStatus: payment_status,
        RecipientCountry: recipient_country || "" ,
        RecipientCity: recipient_city || "" ,
        RecipientPostalCode:recipient_postal_code ||  "",
        RecipientAddress: recipient_address_intl ||  recipient_address || ""
    };

    data.push(parcelData);

    worksheet = XLSX.utils.json_to_sheet(data);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parcels");
    XLSX.writeFile(workbook, filePath);

    res.json({ success: true, message: "Parcel record saved!" });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});