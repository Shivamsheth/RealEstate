// src/services/alertService.js
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)

/**
 * Show a SweetAlert2 modal and return whether the user confirmed.
 *
 * @param {Object} options
 * @param {string} options.title               - Modal title text
 * @param {string} options.text                - Modal body text
 * @param {'success'|'error'|'warning'|'info'|'question'} [options.icon='info']
 * @param {boolean} [options.showCancelButton=false]
 * @param {string} [options.confirmButtonText='OK']
 * @param {string} [options.cancelButtonText='Cancel']
 * @returns {Promise<boolean>} resolves true if confirmed, false otherwise
 */
export async function confirmAlert({
  title,
  text,
  icon = 'info',
  showCancelButton = false,
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancel'
}) {
  const result = await ReactSwal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    background: '#1f2937',
    color: '#f9fafb',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded',
      cancelButton: 'px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded'
    }
  })

  return result.isConfirmed
}