import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useAppDispatch, useAppSelector } from '../../../store'
import { fetchLoanTypes } from '../slices/operations/fetchLoanTypes.operation'
import { createLoanType } from '../slices/operations/createLoanType.operation'
import { updateLoanType } from '../slices/operations/updateLoanType.operation'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import LoanTypesTable from '../components/LoanTypesTable'
import LoanTypeFormModal from '../components/LoanTypeFormModal'
import { LoanTypeTableItem, LoanTypePayload } from '../models/loanTypesModel'

export default function LoanTypesPage() {
  const dispatch = useAppDispatch()
  const { saving } = useAppSelector((state) => state.loanTypes)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLoanType, setSelectedLoanType] = useState<LoanTypeTableItem | null>(null)

  useEffect(() => {
    dispatch(fetchLoanTypes({}))
  }, [dispatch])

  const handleEdit = (loanType: LoanTypeTableItem) => {
    setSelectedLoanType(loanType)
    setIsModalOpen(true)
  }

  const handleSubmit = async (data: LoanTypePayload) => {
    try {
      if (selectedLoanType) {
        // Actualizar
        await dispatch(updateLoanType({ id: selectedLoanType.id, ...data })).unwrap()
        
        await Swal.fire({
          title: '¡Actualizado!',
          text: 'El tipo de préstamo ha sido actualizado.',
          icon: 'success',
          confirmButtonColor: '#FF8546',
        })
      } else {
        // Crear
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
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Tipos de préstamo
          </h1>
          <PageBreadcrumb 
            showTitle={false}
            items={[
              { label: "Home", path: "/dashboard/home" },  
              { label: "Configuración" },
              { label: "Tipos de préstamo" }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <LoanTypesTable 
          onEdit={handleEdit}
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

