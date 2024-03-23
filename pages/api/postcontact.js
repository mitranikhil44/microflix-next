import connectToDatabase from '../../lib/mongodb';
import { Contact } from '../../models/contactSchema';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            const { name, email, contact, message } = req.body; 
            const newContact = new Contact({
                name: name,
                email: email,
                contact: contact,
                message: message,
            });

            await newContact.save();
            res.status(200).json({ success: 'Thank you' }); 

        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' }); 
    }
}
