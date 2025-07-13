import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { uploadMultipleToCloudinary } from "/src/utils/cloudnaryUpload.js?t=1752390105784";
import { convertOffsetToTimes } from "framer-motion";

/**
 * Create a new property document in Firestore
 * @param {Object} form - Form data excluding image files
 * @param {File[]} imageFiles - Array of image files to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string>} - ID of the created property document
 */
export async function createProperty(form, imageFiles = [], onProgress) {
  try {
    const user = auth.currentUser;
   
    if (!user) throw new Error('User not authenticated');

    const urls = imageFiles.length
      ? await uploadMultipleToCloudinary(imageFiles, onProgress)
      : [];

    const {
      imageFiles: _files = [],
      images: _imgs = [],
      ...rest
    } = form;

    const data = {
      ...rest,
      images: urls,
      ownerId: user.uid, // ✅ Required for Firestore rules
      createdAt: serverTimestamp(),
    };

    console.log('Creating property with data:', data);

    const colRef = collection(db, 'properties');
    const docRef = await addDoc(colRef, data);
    console.log('Property created with ID:', docRef.id);
    return docRef.id;
  } catch (err) {
    console.error('Error creating property:', err.message);
    throw err;
  }
}
/**
 * Update an existing property document
 * @param {string} id - Document ID
 * @param {Object} form - Form data
 * @param {File[]} imageFiles - New image files to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<void>}
 */
export async function updateProperty(id, form, imageFiles = [], onProgress) {
  try {
    const newUrls = imageFiles.length
      ? await uploadMultipleToCloudinary(imageFiles, onProgress)
      : [];

    const existing = Array.isArray(form.images) ? [...form.images] : [];
    const allImages = [...existing, ...newUrls];

    const {
      imageFiles: _files = [],
      images: _imgs = [],
      ...rest
    } = form;

    const data = {
      ...rest,
      images: allImages,
      updatedAt: serverTimestamp(),
    };

    console.log('Updating property with data:', data);

    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, data);
    console.log('Property updated:', id);
  } catch (err) {
    console.error('Error updating property:', err.message);
    throw err;
  }
}

/**
 * Delete a property document
 * @param {string} id - Document ID
 * @returns {Promise<void>}
 */
export async function deleteProperty(id) {
  try {
    await deleteDoc(doc(db, 'properties', id));
    console.log('Property deleted:', id);
  } catch (err) {
    console.error('Error deleting property:', err.message);
    throw err;
  }
}