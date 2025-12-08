import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchLoanTypes } from '../slices/operations/fetchLoanTypes.operation'
import { createLoanType } from '../slices/operations/createLoanType.operation'
import { updateLoanType } from '../slices/operations/updateLoanType.operation'
import { deleteLoanType } from '../slices/operations/deleteLoanType.operation'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import LoanTypesTable from '../components/LoanTypesTable'
import LoanTypeFormModal from '../components/LoanTypeFormModal'
import { LoanTypeTableItem, LoanTypePayload } from '../models/loanTypesModel'

export default function LoanTypesPage() {
  const dispatch = useAppDispatch()
  const { saving, pagination } = useAppSelector((state) => state.loanTypes)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLoanType, setSelectedLoanType] = useState<LoanTypeTableItem | null>(null)

  useEffect(() => {
    // @ts-expect-error - Redux Toolkit types issue with React 19
    dispatch(fetchLoanTypes())
  }, [dispatch])

  const handleCreate = () => {
    setSelectedLoanType(null)
    setIsModalOpen(true)
  }

  const handleEdit = (loanType: LoanTypeTableItem) => {
    setSelectedLoanType(loanType)
    setIsModalOpen(true)
  }

  const handleDelete = async (loanType: LoanTypeTableItem) => {
    const result = await Swal.fire({
      title: '¿Eliminar tipo de préstamo?',
      html: `
        <p>Estás a punto de eliminar <strong>${loanType.name}</strong>.</p>
        <p class="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      try {
        // @ts-expect-error - Redux Toolkit types issue with React 19
        await dispatch(deleteLoanType(loanType.id)).unwrap()
        
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'El tipo de préstamo ha sido eliminado.',
          icon: 'success',
          confirmButtonColor: '#FF8546',
        })
      } catch (error) {
        console.error('Error al eliminar:', error)
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el tipo de préstamo.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        })
      }
    }
  }

  const handleSubmit = async (data: LoanTypePayload) => {
    try {
      if (selectedLoanType) {
        // Actualizar
        // @ts-expect-error - Redux Toolkit types issue with React 19
        await dispatch(updateLoanType({ id: selectedLoanType.id, ...data })).unwrap()
        
        await Swal.fire({
          title: '¡Actualizado!',
          text: 'El tipo de préstamo ha sido actualizado.',
          icon: 'success',
          confirmButtonColor: '#FF8546',
        })
      } else {
        // Crear
        // @ts-expect-error - Redux Toolkit types issue with React 19
        await dispatch(createLoanType(data)).unwrap()
        
        await Swal.fire({
          title: '¡Creado!',
          text: 'El tipo de préstamo ha sido creado.',
          icon: 'success',
          confirmButtonColor: '#FF8546',
        })
      }
      
      setIsModalOpen(false)
      setSelectedLoanType(null)
    } catch (error) {
      console.error('Error al guardar:', error)
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el tipo de préstamo.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLoanType(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tipos de Préstamo
          </h1>
          <PageBreadcrumb 
            showTitle={false}
            items={[
              { label: "Home", path: "/dashboard/home" },  
              { label: "Configuración" },
              { label: "Tipos de Préstamo" }
            ]}
          />
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <i className="pi pi-plus"></i>
          Nuevo Tipo
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
              <i className="pi pi-list text-brand-600 dark:text-brand-400 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tipos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <LoanTypesTable 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <LoanTypeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedLoanType}
        saving={saving}
      />
    </div>
  )
}

