'use strict';

const axios = require('axios');
const FormData = require('form-data');

/**
 * Anemia detection model that uses external API for analysis
 * Sends conjunctiva images to localhost:8000/detect/ endpoint
 * and returns detection result with confidence scores
 */
class AnemiaDetectionModel {    /**
     * Analyze a conjunctiva image to detect anemia using external API
     * @param {Object} imageData - The conjunctiva image data
     * @param {Buffer} imageData.buffer - The image data as buffer
     * @param {string} imageData.originalname - Original filename
     * @param {string} imageData.mimetype - Original file type
     * @returns {Promise<Object>} - Object containing detection result and confidence scores
     * @returns {Promise<Object>} - { detection: "Anemic"|"Non-Anemic", confidence: { Anemic: number, "Non-Anemic": number } }
     */
    static async analyzeConjunctiva(imageData) {
        try {
            // Create form data for multipart/form-data request
            const formData = new FormData();
            formData.append('file', imageData.buffer, {
                filename: imageData.originalname,
                contentType: imageData.mimetype
            });

            // Make API call to external anemia detection service
            const response = await axios.post('http://localhost:8000/detect/', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000 // 30 second timeout
            });

            const result = response.data;

            // Validate response format
            if (!result.detection || !result.confidence) {
                throw new Error('Invalid response format from anemia detection API');
            }

            return result;
        } catch (error) {
            console.error('Error calling anemia detection API:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
}

module.exports = AnemiaDetectionModel;
