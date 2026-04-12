import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb'
import { useAppDispatch, useAppSelector } from '../../../store'
import AdvertisingFormModal from '../components/AdvertisingFormModal'
import AdvertisingTable from '../components/AdvertisingTable'
import {
  Advertisement,
  AdvertisingPayload,
  UpdateAdvertisingPayload,
} from '../models/advertisingModel'
import { createAdvertisement } from '../slices/operations/createAdvertisement.operation'
import { deleteAdvertisement } from '../slices/operations/deleteAdvertisement.operation'
import { fetchAdvertisements } from '../slices/operations/fetchAdvertisements.operation'
import { reorderAdvertisements } from '../slices/operations/reorderAdvertisements.operation'
import { setAdvertisementStatus } from '../slices/operations/setAdvertisementStatus.operation'
import { updateAdvertisement } from '../slices/operations/updateAdvertisement.operation'

export default function AdvertisingManagementPage() {
  const dispatch = useAppDispatch()
  const { advertisements, loading, saving } = useAppSelector(
    (state) => state.advertising
  )

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Advertisement | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchAdvertisements({}))
  }, [dispatch])

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return advertisements
    }
    return advertisements.filter((item) => item.title.toLowerCase().includes(term))
  }, [advertisements, search])

  const openCreateModal = () => {
    setSelectedItem(null)
    setIsFormOpen(true)
  }

  const openEditModal = (item: Advertisement) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const closeFormModal = () => {
    setSelectedItem(null)
    setIsFormOpen(false)
  }

  const handleSubmit = async (payload: AdvertisingPayload) => {
    try {
      if (selectedItem) {
        const updatePayload: UpdateAdvertisingPayload = {
          id: selectedItem.id,
          ...payload,
        }
        await dispatch(updateAdvertisement(updatePayload)).unwrap()
      } else {
        await dispatch(createAdvertisement(payload)).unwrap()
      }

      closeFormModal()
      await Swal.fire({
        title: 'Guardado',
        text: 'La publicidad se guardó correctamente',
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la publicidad',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  const handleToggleStatus = async (item: Advertisement) => {
    await dispatch(
      setAdvertisementStatus({ id: item.id, isActive: !item.isActive })
    ).unwrap()
  }

  const handleDelete = async (item: Advertisement) => {
    const result = await Swal.fire({
      title: 'Eliminar publicidad',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await dispatch(deleteAdvertisement(item.id)).unwrap()
      await Swal.fire({
        title: 'Eliminada',
        text: 'La publicidad se eliminó correctamente',
        icon: 'success',
        confirmButtonColor: '#FF8546',
      })
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la publicidad',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      })
    }
  }

  const updateOrderByIndex = async (index: number, direction: 'up' | 'down') => {
    const list = [...advertisements].sort((a, b) => a.sortOrder - b.sortOrder)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) {
      return
    }

    const current = list[index]
    const target = list[targetIndex]
    const items = [
      { id: current.id, sortOrder: target.sortOrder },
      { id: target.id, sortOrder: current.sortOrder },
    ]

    await dispatch(reorderAdvertisements(items)).unwrap()
  }

  const handleMoveUp = async (item: Advertisement) => {
    const list = [...advertisements].sort((a, b) => a.sortOrder - b.sortOrder)
    const index = list.findIndex((entry) => entry.id === item.id)
    await updateOrderByIndex(index, 'up')
  }

  const handleMoveDown = async (item: Advertisement) => {
    const list = [...advertisements].sort((a, b) => a.sortOrder - b.sortOrder)
    const index = list.findIndex((entry) => entry.id === item.id)
    await updateOrderByIndex(index, 'down')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Publicidad
          </h1>
          <PageBreadcrumb
            showTitle={false}
            items={[
              { label: 'Home', path: '/dashboard/home' },
              { label: 'Configuración' },
              { label: 'Gestión de Publicidad' },
            ]}
          />
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white"
        >
          <i className="pi pi-plus mr-2" />
          Nueva publicidad
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <AdvertisingTable
        data={filteredData}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />

      <AdvertisingFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        saving={saving}
      />
    </div>
  )
}
