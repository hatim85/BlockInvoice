import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const PayInvoice = () => {
    const [invoiceId, setInvoiceId] = useState("");
    const [invoiceDetails, setInvoiceDetails] = useState(null);

    const handleFetchInvoice = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/getInvoice/${invoiceId}`);
            setInvoiceDetails(response.data.invoice);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePayment = async () => {
        if (!invoiceDetails) return;
        try {
            // Assume Web3 or ethers.js is set up to handle wallet transactions
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            console.log(signer)
            const tx = await signer.sendTransaction({
                to: invoiceDetails.payer,
                value: ethers.parseEther(invoiceDetails.amount.toString())
            });

            // Handle transaction success and redirect to Payment Confirmation page
            window.location.href = `/paymentConfirmation/${tx.hash}`;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Pay Invoice</h2>
            <input
                type="text"
                className="w-full max-w-md p-3 rounded-md border border-gray-300"
                placeholder="Enter Invoice ID"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
            />
            <button
                className="mt-4 bg-blue-500 text-white py-3 px-6 rounded-md"
                onClick={handleFetchInvoice}
            >
                Fetch Invoice
            </button>

            {invoiceDetails && (
                <div className="mt-6 space-y-4">
                    <p><strong>Amount:</strong> {invoiceDetails.amount}</p>
                    <p><strong>Recipient:</strong> {invoiceDetails.payer}</p>
                    <p><strong>Due Date:</strong> {invoiceDetails.dueDate}</p>
                    <button
                        className="mt-4 bg-green-500 text-white py-3 px-6 rounded-md"
                        onClick={handlePayment}
                    >
                        Pay Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default PayInvoice;
