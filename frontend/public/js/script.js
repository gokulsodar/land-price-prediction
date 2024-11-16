document.addEventListener('DOMContentLoaded', () => {
    const states = ['Puerto Rico', 'Virgin Islands', 'Massachusetts', 'Connecticut',
       'New Hampshire', 'Vermont', 'New Jersey', 'New York',
       'South Carolina', 'Tennessee', 'Rhode Island', 'Virginia',
       'Wyoming', 'Maine', 'Georgia', 'Pennsylvania', 'West Virginia',
       'Delaware', 'Louisiana', 'Ohio', 'California', 'Colorado',
       'Maryland', 'Missouri', 'District of Columbia', 'Wisconsin',
       'North Carolina', 'Kentucky', 'Michigan', 'Mississippi', 'Florida',
       'Alabama', 'New Brunswick', 'Texas', 'Arkansas', 'Idaho',
       'Indiana', 'Illinois', 'New Mexico', 'Iowa', 'Minnesota',
       'South Dakota', 'Nebraska', 'North Dakota', 'Montana', 'Oklahoma',
       'Kansas', 'Oregon', 'Utah', 'Nevada', 'Washington', 'Arizona',
       'Hawaii', 'Guam', 'Alaska'];

    const statuses = ['For sale', 'Ready to build', 'Sold'];

    const stateSelect = document.getElementById('state');
    const statusSelect = document.getElementById('status');

    states.forEach(state => {
        if (state) { // Check to avoid adding 'nan' or empty values
            const option = document.createElement('option');
            option.value = state.toLowerCase().replace(/\s+/g, '_');
            option.textContent = state;
            stateSelect.appendChild(option);
        }
    });

    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status.replace(/_/g, ' '); // Format for display
        statusSelect.appendChild(option);
    });
});









document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    // Add event listeners for real-time validation
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', validateInput);
    });

    // Form submit event
    form.addEventListener('submit', (event) => {
        let valid = true;

        // Validate all inputs on submit
        inputs.forEach(input => {
            if (!validateInput({ target: input })) {
                valid = false;
            }
        });

        if (!valid) {
            event.preventDefault();
        }
    });

    // Validation function
    function validateInput(event) {
        const input = event.target;
        const errorDiv = document.getElementById(`error-${input.id}`);
        const value = input.value.trim();
        let isValid = true;

        if (isNaN(value) || value === '') {
            errorDiv.textContent = 'Please enter a valid number.';
            isValid = false;
        } else {
            errorDiv.textContent = '';
        }

        return isValid;
    }
});




// // THE CODE BELOW IS FOR SENDING TO FASTAPI SERVER


// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('form');

//     form.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData.entries());

//         try {
//             const response = await fetch('http://localhost:8000/predict', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const result = await response.json();
//             console.log('Server response:', result);
//             alert('Data sent successfully. Check server console and browser console for details.');
//         } catch (error) {
//             console.error('Error:', error);
//             alert('There was an error sending the data. Please try again.');
//         }
//     });
// });











// NEW TRY TO SEND AND RECEIVE THE DATA



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const priceInput = document.getElementById('Price');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const predictedPrice = result.predicted_price;

            console.log('Predicted Price:', predictedPrice);
            
            // Update the Price input field with the predicted price
            priceInput.value = `$${predictedPrice.toFixed(2)}`;
            
            // alert('Prediction received successfully. Check the form and browser console for details.');
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error getting the prediction. Please try again.');
            priceInput.value = 'Error: Could not get prediction';
        }
    });
});
