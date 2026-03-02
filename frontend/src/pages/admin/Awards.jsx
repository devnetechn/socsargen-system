import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAward, FiUpload, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getBaseURL } from '../../utils/url';

const API_URL = getBaseURL();

const COLOR_OPTIONS = [
  { value: 'rose', label: 'Rose / Pink', preview: 'bg-rose-500' },
  { value: 'amber', label: 'Amber / Gold', preview: 'bg-amber-500' },
  { value: 'emerald', label: 'Emerald / Green', preview: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue / Indigo', preview: 'bg-blue-500' },
  { value: 'purple', label: 'Purple / Violet', preview: 'bg-purple-500' },
];

const AdminAwards = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingAward, setEditingAward] = useState(null);

  // Fetch all awards (admin)
  const { data: awardsList, isLoading } = useQuery({
    queryKey: ['adminAwards'],
    queryFn: () => api.get('/awards/admin/all').then(res => res.data)
  });

  // Create
  const createAward = useMutation({
    mutationFn: (data) => api.post('/awards', data),
    onSuccess: () => {
      toast.success('Award created!');
      queryClient.invalidateQueries(['adminAwards']);
      queryClient.invalidateQueries(['awards']);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create award.');
    }
  });

  // Update
  const updateAward = useMutation({
    mutationFn: ({ id, data }) => api.put(`/awards/${id}`, data),
    onSuccess: () => {
      toast.success('Award updated!');
      queryClient.invalidateQueries(['adminAwards']);
      queryClient.invalidateQueries(['awards']);
      setEditingAward(null);
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update award.');
    }
  });

  // Delete
  const deleteAward = useMutation({
    mutationFn: (id) => api.delete(`/awards/${id}`),
    onSuccess: () => {
      toast.success('Award deleted!');
      queryClient.invalidateQueries(['adminAwards']);
      queryClient.invalidateQueries(['awards']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete award.');
    }
  });

  // Toggle active
  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/awards/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Award status updated!');
      queryClient.invalidateQueries(['adminAwards']);
      queryClient.invalidateQueries(['awards']);
    },
    onError: () => {
      toast.error('Failed to update status.');
    }
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteAward.mutate(id);
    }
  };

  const handleEdit = (award) => {
    setEditingAward(award);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAward(null);
    setShowModal(true);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-4"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Patient's Choice Awards</h1>
              <p className="text-gray-600">Manage award cards displayed on Home and News pages.</p>
            </div>
            <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2 w-fit">
              <FiPlus /> Add Award
            </button>
          </div>
        </div>

        {/* Awards List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : awardsList?.length === 0 ? (
          <div className="card text-center py-12">
            <FiAward className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Awards Yet</h3>
            <p className="text-gray-500 mb-6">Create your first patient choice award.</p>
            <button onClick={handleAdd} className="btn btn-primary">
              Add First Award
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {awardsList?.map((award) => (
              <div key={award.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Photo thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    {award.photoUrl ? (
                      <img
                        src={award.photoUrl.startsWith('http') ? award.photoUrl : `${API_URL}${award.photoUrl}`}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiAward className="text-gray-300 text-2xl" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-lg">{award.title}</h3>
                      {/* Color theme dot */}
                      <span className={`w-4 h-4 rounded-full ${COLOR_OPTIONS.find(c => c.value === award.colorTheme)?.preview || 'bg-amber-500'}`} title={`Theme: ${award.colorTheme}`} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        award.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {award.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-primary-600 font-medium text-sm mb-1">{award.recipient}</p>
                    <p className="text-gray-500 text-sm line-clamp-1">{award.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>Votes: {award.votes?.toLocaleString()}</span>
                      <span>Order: {award.displayOrder}</span>
                      {award.awardMonth && (
                        <span>Month: {new Date(award.awardMonth).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive.mutate({ id: award.id, isActive: !award.isActive })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        award.isActive
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {award.isActive ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleEdit(award)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(award.id, award.title)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <AwardModal
            award={editingAward}
            onClose={() => {
              setShowModal(false);
              setEditingAward(null);
            }}
            onSubmit={(data) => {
              if (editingAward) {
                updateAward.mutate({ id: editingAward.id, data });
              } else {
                createAward.mutate(data);
              }
            }}
            isLoading={createAward.isPending || updateAward.isPending}
          />
        )}
      </div>
    </div>
  );
};

// Award Modal Component
const AwardModal = ({ award, onClose, onSubmit, isLoading }) => {
  const fileInputRef = useRef(null);
  const getDefaultMonth = () => {
    if (award?.awardMonth) {
      const d = new Date(award.awardMonth);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    title: award?.title || '',
    recipient: award?.recipient || '',
    description: award?.description || '',
    photoUrl: award?.photoUrl || '',
    votes: award?.votes || 0,
    colorTheme: award?.colorTheme || 'amber',
    displayOrder: award?.displayOrder || 0,
    awardMonth: getDefaultMonth(),
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    award?.photoUrl ? (award.photoUrl.startsWith('http') ? award.photoUrl : `${API_URL}${award.photoUrl}`) : ''
  );
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? parseInt(value) || 0 : value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files are allowed (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({ ...formData, photoUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photoUrl = formData.photoUrl;

    // Upload image if new file selected
    if (selectedFile) {
      setUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('image', selectedFile);
        const response = await api.post('/upload/image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = response.data.imageUrl;
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to upload image.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    onSubmit({ ...formData, photoUrl, awardMonth: formData.awardMonth + '-01' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {award ? 'Edit Award' : 'Create New Award'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Award Photo</label>
              {previewUrl ? (
                <div className="relative mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition mb-3"
                >
                  <FiUpload className="text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition text-sm"
                >
                  <FiUpload /> Change Photo
                </button>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Award Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Most Compassionate Care"
              />
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient *</label>
              <input
                type="text"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Department of Pediatrics"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Brief description of the award..."
              />
            </div>

            {/* Votes + Color Theme + Display Order */}
            {/* Award Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Award Month *</label>
              <input
                type="month"
                name="awardMonth"
                value={formData.awardMonth}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Votes</label>
                <input
                  type="number"
                  name="votes"
                  value={formData.votes}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                <select
                  name="colorTheme"
                  value={formData.colorTheme}
                  onChange={handleChange}
                  className="input"
                >
                  {COLOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />
              </div>
            </div>

            {/* Color Preview */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Preview:</span>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full ${COLOR_OPTIONS.find(c => c.value === formData.colorTheme)?.preview || 'bg-amber-500'}`} />
                <span className="text-sm font-medium text-gray-700">
                  {COLOR_OPTIONS.find(c => c.value === formData.colorTheme)?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || uploading} className="btn btn-primary flex-1">
              {uploading ? 'Uploading...' : isLoading ? 'Saving...' : award ? 'Update Award' : 'Create Award'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAwards;
