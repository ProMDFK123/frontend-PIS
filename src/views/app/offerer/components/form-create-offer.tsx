import { useState, useEffect } from 'react';
import {FormData} from '@/models/generics'

export default function PublicationForm() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        offerType: '0', // Por defecto 'Trabajo'
        endDate: '',
        deadlineDate: '',
        remuneration: '',
        location: '',
        requirements: '',
        contactInfo: '',
        isCvRequired: false,
    });

  
    return (

    )

}

  