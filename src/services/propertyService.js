// src/services/propertyService.js
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';

/**
 * Upload an array of File objects to Storage under property_images/{propertyId}/
 * Returns an array of download URLs
 */
export async function uploadPropertyImages(propertyId, files, onProgress) {
  const uploadPromises = files.map((file, idx) => {
    const path = `property_images/${propertyId}/${Date.now()}_${file.name}`;
    const ref = storageRef(storage, path);
    const task = uploadBytesResumable(ref, file);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        snapshot => {
          if (onProgress) {
            const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(idx, pct);
          }
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });
  });

  return Promise.all(uploadPromises);
}

/**
 * Create a new property document in Firestore
 */
export async function createProperty(data, imageFiles = [], onProgress) {
  const colRef = collection(db, 'properties');
  // Create a doc with an ID but no data yet (so we have an ID for storage path)
  const docRef = doc(colRef);

  // 1) Upload images, get URLs
  const imageUrls = imageFiles.length
    ? await uploadPropertyImages(docRef.id, imageFiles, onProgress)
    : [];

  // 2) Write the property record
  await setDoc(docRef, {
    ...data,
    images: imageUrls,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return docRef.id;
}

/**
 * Update existing property (optionally add new files or remove old ones)
 */
export async function updateProperty(propertyId, data, newFiles = [], onProgress) {
  const docRef = doc(db, 'properties', propertyId);

  // 1) Upload new files if any
  const newUrls = newFiles.length
    ? await uploadPropertyImages(propertyId, newFiles, onProgress)
    : [];

  // 2) Merge existing data + new URLs + updatedAt
  await updateDoc(docRef, {
    ...data,
    images: [...(data.images || []), ...newUrls],
    updatedAt: Date.now(),
  });
}

/**
 * Delete a property and optionally its images
 */
export async function deleteProperty(propertyId) {
  // TODO: optionally list & delete storage folder first
  await deleteDoc(doc(db, 'properties', propertyId));
}   