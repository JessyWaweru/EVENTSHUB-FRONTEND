import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface EventPaymentProps {
  handleBooking: () => void;
}

interface CardDetails {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  cvv: string;
}

type PaymentMethod = '' | 'Mpesa' | 'Card';

const EventPayment: React.FC<EventPaymentProps> = ({ handleBooking }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [paymentCode, setPaymentCode] = useState<string>('');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: ''
  });
  const [isEventBooked, setIsEventBooked] = useState<boolean>(false);

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const validateCardDetails = (): boolean => {
    // Basic validation logic
    return (
      cardDetails.cardNumber.length >= 16 &&
      cardDetails.cardHolderName.length > 0 &&
      cardDetails.expirationDate.length >= 4 &&
      cardDetails.cvv.length >= 3
    );
  };

  const handlePaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentMethod === 'Mpesa' && contactNumber && paymentCode) {
      // TODO: Process Mpesa payment via Django backend
      setIsEventBooked(true);
      handleBooking(); 
    } else if (paymentMethod === 'Card' && validateCardDetails()) {
      // TODO: Process Card payment via Django backend
      setIsEventBooked(true);
      handleBooking(); 
    } else {
      // You could add a toast notification here to alert the user of invalid details
      console.error("Invalid payment details");
    }
  };

  if (isEventBooked) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8 border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 text-green-700">
          <CheckCircle2 size={48} className="text-green-500" />
          <p className="text-xl font-bold">Event booked successfully!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">Checkout</CardTitle>
        <CardDescription>Select your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select 
              value={paymentMethod} 
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
            >
              <SelectTrigger id="paymentMethod" className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mpesa">M-Pesa</SelectItem>
                <SelectItem value="Card">Credit/Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'Mpesa' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">M-Pesa Phone Number</Label>
                <Input 
                  type="text" 
                  id="contactNumber" 
                  placeholder="e.g., 254700000000"
                  value={contactNumber} 
                  onChange={(e) => setContactNumber(e.target.value)} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentCode">M-Pesa Transaction Code</Label>
                <Input 
                  type="text" 
                  id="paymentCode" 
                  placeholder="e.g., QWE123RTY4"
                  value={paymentCode} 
                  onChange={(e) => setPaymentCode(e.target.value)} 
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'Card' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Card Holder Name</Label>
                <Input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  placeholder="John Doe"
                  value={cardDetails.cardHolderName}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    placeholder="MM/YY"
                    value={cardDetails.expirationDate}
                    onChange={handleCardDetailsChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4" 
            type="submit"
            disabled={!paymentMethod}
          >
            Confirm Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventPayment;