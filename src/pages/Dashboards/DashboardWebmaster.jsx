import { useContext, useEffect, useState } from "react"
import { ApiContext } from "../../context/apiContext"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import { MdVerifiedUser, MdPending, MdBlock, MdOutlineWarningAmber } from "react-icons/md"
import Modals from "../../components/Modals"
import { Loader } from "../../components/Loader"

const DashboardWebmaster = () => {
  const navigate = useNavigate()

  const {
    loading,
    storedAdmin,
    getAllAdmins,
    allAdmins,
    approveAdmin,
    denyAdmin,
    removeAdmin,
  } = useContext(ApiContext)

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    adminId: '',
    error: ''
  })

  const [filterStatus, setFilterStatus] = useState('all')

  const openModal = (type, id) => {
    setModalState({ isOpen: true, type, adminId: id, error: '' })
  }

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false, error: '' }))
  }

  const handleModalAction = async () => {
    try {
      let result
      if (modalState.type === 'approve') {
        result = await approveAdmin(modalState.adminId)
      } else if (modalState.type === 'deny') {
        result = await denyAdmin(modalState.adminId)
      } else if (modalState.type === 'remove') {
        result = await removeAdmin(modalState.adminId)
      }

      if (result !== '') {
        setModalState(prev => ({ ...prev, error: result }))
        return
      }

      closeModal()
      getAllAdmins()
    } catch (err) {
      setModalState(prev => ({
        ...prev,
        error: 'Something went wrong. Please try again.',
      }))
    }
  }

  useEffect(() => {
    if (storedAdmin?.role !== 'webmaster') {
      navigate('/')
    }
    getAllAdmins()
  }, [navigate, storedAdmin?.role, getAllAdmins])

  if (loading) {
    return <Loader text="Please wait..." />
  }

  // Counts
  const approvedCount = allAdmins?.filter(a => a.status === 'approved').length || 0
  const pendingCount = allAdmins?.filter(a => a.status === 'pending').length || 0
  const deniedCount = allAdmins?.filter(a => a.status === 'denied').length || 0

  // Filtering and Sorting
  const sortedStatusOrder = { approved: 1, pending: 2, denied: 3 }
  const filteredAdmins = allAdmins
    ?.filter(admin =>
      filterStatus === 'all' ? true : admin.status === filterStatus
    )
    .sort((a, b) =>
      filterStatus === 'all'
        ? sortedStatusOrder[a.status] - sortedStatusOrder[b.status]
        : 0
    )

  return (
    <>
      {/* Modal Component */}
      {modalState.isOpen && (
        <Modals
          title={
            modalState.type === 'approve'
              ? 'Approve Admin'
              : modalState.type === 'deny'
              ? 'Deny Admin'
              : 'Remove Admin'
          }
          caption={
            modalState.type === 'approve'
              ? 'Are you sure you want to approve this admin?'
              : modalState.type === 'deny'
              ? 'Are you sure you want to deny this admin access?'
              : 'Are you sure you want to remove this admin? This action cannot be undone.'
          }
          icon={
            modalState.type === 'approve' ? (
              <MdVerifiedUser size={24} className="text-green-600" />
            ) : modalState.type === 'deny' ? (
              <MdBlock size={24} className="text-red-600" />
            ) : (
              <MdOutlineWarningAmber size={24} className="text-red-600" />
            )
          }
          iconStyle={
            modalState.type === 'approve'
              ? 'bg-green-100'
              : 'bg-red-100'
          }
          calltoactionCaption={
            modalState.type === 'approve'
              ? 'Approve'
              : modalState.type === 'deny'
              ? 'Deny'
              : 'Remove'
          }
          btnstyles={
            modalState.type === 'approve'
              ? 'bg-green-600 hover:bg-green-500'
              : 'bg-red-600 hover:bg-red-500'
          }
          closeModal={closeModal}
          calltoaction={handleModalAction}
          error={modalState.error}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Admin Management</h1>
            <p className="mt-3 text-lg text-gray-500">Review and manage employee requests</p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex justify-end mb-6">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Admins ({allAdmins.length})</option>
              <option value="approved">Approved ({approvedCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="denied">Denied ({deniedCount})</option>
            </select>
          </div>

          {/* Admin Cards */}
          <div className="space-y-6">
            {filteredAdmins?.map((employee) => (
              <div
                key={employee._id.slice(3)}
                className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Employee Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="bg-indigo-100 capitalize text-indigo-800 rounded-full w-12 h-12 flex items-center justify-center font-bold">
                            {employee.firstname[0]}{employee.lastname[0]}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {employee.firstname} {employee.lastname}
                          </h3>
                          <p className="text-gray-600 mt-1">{employee.email}</p>
                          <p className="text-gray-600 mt-1 text-xs">{employee.phone}</p>
                          <div className="flex items-center gap-3">
                            <span className="capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                              {employee.role}
                            </span>
                            <span>
                              {employee.status === 'approved' && <MdVerifiedUser className="text-green-600 mt-2" />}
                              {employee.status === 'denied' && <MdBlock className="text-red-600 mt-2" />}
                              {employee.status === 'pending' && <MdPending className="text-blue-600 mt-2" />}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      {employee.status === 'approved' ? (
                        <>
                          <Button
                            caption="Deny"
                            onclick={() => openModal('deny', employee._id)}
                            styles="bg-red-600 hover:bg-red-700 text-white"
                          />
                          <Button
                            caption="Remove"
                            onclick={() => openModal('remove', employee._id)}
                            styles="bg-white border text-gray-700"
                          />
                        </>
                      ) : employee.status === 'denied' ? (
                        <>
                          <Button
                            caption="Approve"
                            onclick={() => openModal('approve', employee._id)}
                            styles="bg-green-600 hover:bg-green-700 text-white"
                          />
                          <Button
                            caption="Remove"
                            onclick={() => openModal('remove', employee._id)}
                            styles="bg-white border text-gray-700"
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            caption="Approve"
                            onclick={() => openModal('approve', employee._id)}
                            styles="bg-green-600 hover:bg-green-700 text-white"
                          />
                          <Button
                            caption="Deny"
                            onclick={() => openModal('deny', employee._id)}
                            styles="bg-red-600 hover:bg-red-700 text-white"
                          />
                          <Button
                            caption="Remove"
                            onclick={() => openModal('remove', employee._id)}
                            styles="bg-white border text-gray-700"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardWebmaster

