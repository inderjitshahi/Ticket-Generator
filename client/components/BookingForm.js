import { useState } from 'react';
import axios from 'axios';
const URL = " http://localhost:5000/generate-ticket";
const BookingForm = () => {
    const [formData, setFormData] = useState({
        experienceName: '',
        date: '',
        numberOfPersons: '',
        customerName: '',
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.experienceName.trim()) {
            newErrors.experienceName = 'Experience Name is required';
        }

        if (!formData.date.trim()) {
            newErrors.date = 'Date is required';
        }

        if (!formData.numberOfPersons.trim() || isNaN(formData.numberOfPersons)) {
            newErrors.numberOfPersons = 'Number of Persons must be a valid number';
        }

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Customer Name is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Send request to server using Axios
            try {
                const response = await axios.post(URL, formData, { responseType: 'arraybuffer' });

                // Create a blob from the response data
                const blob = new Blob([response.data], { type: response.headers['content-type'] });


                // Create a download link
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = 'ticket.png';

                // Trigger the download
                downloadLink.click();


                // Reset the form
                setFormData({
                    experienceName: '',
                    date: '',
                    numberOfPersons: '',
                    customerName: '',
                });

                setErrors({});
            } catch (error) {
                // Handle errors
                console.error('Error sending request:', error);
            }
        }

        // Reset the form
        setFormData({
            experienceName: '',
            date: '',
            numberOfPersons: '',
            customerName: '',
        });

        setErrors({});
    };



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <form className="max-w-md mx-5 md:mx-auto mt-8  md:margin-0" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Experience Name
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.experienceName ? 'border-red-500' : ''
                        }`}
                    type="text"
                    name="experienceName"
                    value={formData.experienceName}
                    onChange={handleChange}
                />
                <p className="text-red-500 text-xs italic">{errors.experienceName}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date ? 'border-red-500' : ''
                        }`}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                <p className="text-red-500 text-xs italic">{errors.date}</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Number of Persons
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.numberOfPersons ? 'border-red-500' : ''
                        }`}
                    type="number"
                    name="numberOfPersons"
                    value={formData.numberOfPersons}
                    onChange={handleChange}
                    step={1}
                />
                <p className="text-red-500 text-xs italic">{errors.numberOfPersons}</p>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Customer Name
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.customerName ? 'border-red-500' : ''
                        }`}
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                />
                <p className="text-red-500 text-xs italic">{errors.customerName}</p>
            </div>

            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default BookingForm;
