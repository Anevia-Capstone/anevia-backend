'use strict';

const axios = require('axios');
const FormData = require('form-data');

/**
 * Eye cropping model that uses external API for conjunctiva extraction
 * Sends eye images to external endpoint and returns cropped conjunctiva image
 */
class EyeCroppingModel {
    /**
     * Process an eye image to extract the conjunctiva region using external API
     * @param {Object} fileData - The original file data
     * @param {Buffer} fileData.buffer - The image data as buffer
     * @param {string} fileData.originalname - Original filename
     * @param {string} fileData.mimetype - Original file type
     * @returns {Promise<Buffer>} - A buffer containing the cropped conjunctiva image
     */
    static async extractConjunctiva(fileData) {
        try {
            const formData = new FormData();
            formData.append('file', fileData.buffer, {
                filename: fileData.originalname,
                contentType: fileData.mimetype
            });

            // API endpoint for conjunctiva cropping at localhost:8000
            const CROPPING_API_URL = process.env.EYE_CROPPING_API_URL || 'http://localhost:8000/crop/';
            const response = await axios.post(CROPPING_API_URL, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'arraybuffer', // Important: to receive image data as buffer
                timeout: 30000 // 30 second timeout
            });

            // Convert response data to Buffer
            const conjunctivaBuffer = response.data instanceof Buffer ? response.data : Buffer.from(response.data);

            console.log('Eye cropping completed successfully - received PNG image');
            return conjunctivaBuffer;

        } catch (error) {
            console.error('Error in eye cropping model:', error.message);
            throw error; // Re-throw the error instead of returning the original buffer
        }
    }
}

module.exports = EyeCroppingModel;
