import easyinvoice from "easyinvoice";
import { Button } from "antd";

import React, { useState, useEffect } from "react";
import axios from "axios";
import primary_instance from "./axios_primary_instance";
//import easyinvoice from 'easyinvoice';

function InvoiceGenerator(props) {
  const [invoiceBase64, setInvoiceBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setvehicleDetails] = useState();
  const [productPrice, setproductPrice] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);

  const order = props.order;
  const params = {
    vehicle_id: order.product,
  };
  useEffect(() => {
    primary_instance
      .get(`/vehicles_view/`, {
        params: params,
      })
      .then((res) => {
        console.log(res.data.vehicles);
        setvehicleDetails(res.data.vehicles[0]);
        settotalAmount(order.amount);

      });
  }, []);



  async function createInvoice() {
    // See documentation for all data properties
    const data = getSampleData();
    const result = await easyinvoice.createInvoice(data);
    setInvoiceBase64(result.pdf);
  }

  async function downloadInvoice() {
    setLoading(true);
    // See documentation for all data properties
    const data = getSampleData();
    const result = await easyinvoice.createInvoice(data);
    easyinvoice.download("myInvoice.pdf", result.pdf);
    setLoading(false);
  }

  async function renderInvoice() {
    // See documentation for all data properties
    document.getElementById("pdf").innerHTML = "loading...";
    const data = getSampleData();
    const result = await easyinvoice.createInvoice(data);
    easyinvoice.render("pdf", result.pdf);
  }

  function getSampleData() {
    let price = (totalAmount / 1.2);
    console.log("total", totalAmount);
    console.log("og price", price);
    setproductPrice(price);
    return {
      images: {
        logo: "https://imgtr.ee/images/2023/10/16/0b1627e76b02ed35429be96bedfe5876.png",
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      sender: {
        company: "Loomix Rentals",
        address: "Dotspace Business Park, Kazhakuttom",
        zip: "689575",
        city: "Kerala",
        country: "India",
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      client: {
        company: "Client Corp",
        address: "Clientstreet 456",
        city: "Clientcity",
        country: "Clientcountry",
        zip: "4567 CD",
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      information: {
        number: "2021.0001",
        date: order.order_date,
      },
      products: [
        {
          quantity: 1,
          description: vehicleDetails.make + " " + vehicleDetails.model,
          "tax-rate": 20,
          
          price: price,
        },
      ],
      // "bottom-notice": "Kindly pay your invoice within 15 days.",
      settings: {
        currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        // "locale": "nl-NL", // Defaults to en-US, used for number formatting (see docs)
        // "margin-top": 25, // Default to 25
        // "margin-right": 25, // Default to 25
        // "margin-left": 25, // Default to 25
        // "margin-bottom": 25, // Default to 25
        // "format": "Letter", // Defaults to A4,
        // "height": "1000px", // allowed units: mm, cm, in, px
        // "width": "500px", // allowed units: mm, cm, in, px
        // "orientation": "landscape", // portrait or landscape, defaults to portrait
      },
      // Used for translating the headers to your preferred language
      // Defaults to English. Below example is translated to Dutch
      translate: {
        //     "invoice": "FACTUUR",
        //     "number": "Nummer",
        //     "date": "Datum",
        //     "due-date": "Verloopdatum",
        //     "subtotal": "Subtotaal",
        //     "products": "Producten",
        //     "quantity": "Aantal",
        //     "price": "Prijs",
        //     "product-total": "Totaal",
        //     "total": "Totaal"
        		 "vat": "GST"
      },
    };
  }

  return (
    <div>
      {/* <button onClick={createInvoice}>Create Invoice</button> */}
      {!loading ? (
        <Button type="text" primary onClick={downloadInvoice}>
          Invoice
        </Button>
      ) : (
        <p>Loading... </p>
      )}
      {/* <button onClick={renderInvoice}>Render Invoice</button> */}
      <br />
      <br />

      <div id="pdf"></div>
    </div>
  );
}

export default InvoiceGenerator;
