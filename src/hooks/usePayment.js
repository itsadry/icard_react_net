import { useState} from 'react'
import {createPaymentApi, getPaymentsByTableApi, closePaymentApi, getPaymentApi} from '../api/payment'


export const usePayment = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [payments, setPayments] = useState(null);
    const createPayment = async (paymentData) => {
        try {
            return await createPaymentApi(paymentData);
           
        } catch (error) {
            setError(error);
        }
    }

    const getPaymentsByTable = async (idTable) => {
        try {
            
            return await getPaymentsByTableApi(idTable);
            
        } catch (error) {
            setError(error);
        }
    }

    const closePayment = async (idPayment) => {
        try {
            
            await closePaymentApi(idPayment);
            
        } catch (error) {
            setError(error);
        }
    }

    const getPayments = async () => {
        try {
            
            setLoading(true);
            const response = await getPaymentApi();
            setLoading(false);
            setPayments(response);
        } catch (error) {

            setLoading(false);
            setError(error);
        }
    }

    return {loading, error, payments, createPayment, getPaymentsByTable, closePayment, getPayments};
}


