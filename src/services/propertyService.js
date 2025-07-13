// src/services/propertyService.js
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadMultipleToCloudinary } from '../utils/cloudnaryUpload';

/**
 * Create a new property document in Firestore
 */
export async function createProperty(data, imageFiles = [], onProgress) {
  const colRef = collection(db, 'properties');
  const docRef = doc(colRef); // generate ID

  // 1) Upload images to Cloudinary
  const imageUrls = imageFiles.length
    ? await uploadMultipleToCloudinary(imageFiles, onProgress)
    : [];

  // 2) Save property to Firestore
  await setDoc(docRef, {
    ...data,
    images: imageUrls,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return docRef.id;
}

/**
 * Update existing property (optionally add new images)
 */
export async function updateProperty(propertyId, data, newFiles = [], onProgress) {
  const docRef = doc(db, 'properties', propertyId);

  // 1) Upload new images to Cloudinary
  const newUrls = newFiles.length
    ? await uploadMultipleToCloudinary(newFiles, onProgress)
    : [];

  // 2) Merge and update Firestore
  await updateDoc(docRef, {
    ...data,
    images: [...(data.images || []), ...newUrls],
    updatedAt: Date.now(),
  });
}

/**
 * Delete a property from Firestore
 * Note: Cloudinary images are not deleted unless you store public IDs and call their API
 */
export async function deleteProperty(propertyId) {
  await deleteDoc(doc(db, 'properties', propertyId));
}