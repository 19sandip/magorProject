const axios = require("axios");

const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search`;
    try {
        const response = await axios.get(url, {
            params: {
                q: address,
                format: 'json'
            }
        });
        if (response.data.length > 0) {
            return response.data[0];
        } else {
            console.log('Address not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


module.exports = getCoordinates;