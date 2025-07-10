// src/components/Common/Alert.jsx
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ReactSwal = withReactContent(Swal);

export default function Alert({ 
  title = '', 
  text = '', 
  icon = 'info', 
  showCancelButton = false, 
  confirmButtonText = 'OK', 
  cancelButtonText = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {},
  onClose = () => {}
}) {
  useEffect(() => {
    ReactSwal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      background: '#1f2937',
      color: '#f9fafb'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.isDismissed) {
        onCancel();
      }
      onClose();
    });
    // cleanup ReactSwal instance on unmount
    return () => {
      ReactSwal.close();
    };
  }, []);
  
  return null;
}