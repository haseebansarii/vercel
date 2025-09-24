import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
import { Entity } from '../types';
import { db } from '../lib/database';
import { redactSensitiveInfo, reportCategories } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';

interface ReportForm {
  entity_id: string;
  type: 'positive' | 'negative';
  category: string;
  title: string;
  description: string;
  is_anonymous: boolean;
}

interface NewEntityForm {
  name: string;
  type: 'company' | 'individual';
  description: string;
  location: string;
  reportType: 'positive' | 'negative';
  category: string;
}

export function SubmitReport() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewEntityModal, setShowNewEntityModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [preservedFormData, setPreservedFormData] = useState<Partial<ReportForm>>({});
  const [newEntityReportType, setNewEntityReportType] = useState<'positive' | 'negative' | ''>('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReportForm>({
    mode: 'onChange'
  });
  const { register: registerEntity, handleSubmit: handleSubmitEntity, watch: watchEntity, setValue: setEntityValue, formState: { errors: entityErrors } } = useForm<NewEntityForm>({
    mode: 'onChange'
  });

  const reportType = watch('type');
  const entityReportType = watchEntity('reportType');

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const data = await db.getEntities();
      setEntities(data);
    } catch (error: any) {
      toast.error('Failed to fetch entities');
      console.error('Error:', error);
    }
  };

  const createNewEntity = async (data: NewEntityForm) => {
    // Validate required fields manually since we're using controlled components
    if (!data.reportType) {
      toast.error('Please select a report type');
      return;
    }
    if (!data.category) {
      toast.error('Please select a category');
      return;
    }
    if (!data.name) {
      toast.error('Please enter entity name');
      return;
    }
    if (!data.type) {
      toast.error('Please select entity type');
      return;
    }

    try {
      const newEntity = await db.createEntity(data);

      setEntities(prev => [...prev, newEntity]);
      setValue('entity_id', newEntity.id);
      
      // Set form data from new entity form
      setValue('type', data.reportType);
      setValue('category', data.category);
      
      // Restore other preserved form data
      if (preservedFormData.title) {
        setValue('title', preservedFormData.title);
      }
      if (preservedFormData.description) {
        setValue('description', preservedFormData.description);
      }
      if (preservedFormData.is_anonymous !== undefined) {
        setValue('is_anonymous', preservedFormData.is_anonymous);
      }
      
      setShowNewEntityModal(false);
      setPreservedFormData({});
      setNewEntityReportType('');
      toast.success('Entity created successfully');
    } catch (error: any) {
      toast.error('Failed to create entity');
      console.error('Error:', error);
    }
  };

  const onSubmit = async (data: ReportForm) => {
    if (!user) return;

    // Log form data to help debug submission issues
    console.log('Submitting form data:', {
      entity_id: data.entity_id,
      type: data.type,
      category: data.category,
      description: data.description?.length,
      files: selectedFiles.length
    });

    // Validate all required fields explicitly
    if (!data.entity_id) {
      toast.error('Please select an entity');
      return;
    }
    if (!data.type) {
      toast.error('Please select a report type');
      return;
    }
    if (!data.category) {
      toast.error('Please select a category');
      return;
    }
    if (!data.description || data.description.length < 50) {
      toast.error('Please enter a description (minimum 50 characters)');
      return;
    }

    try {
      setLoading(true);

      // Redact sensitive information
      const redactedDescription = redactSensitiveInfo(data.description);

      const reportData = {
        ...data,
        reporter_id: user.id,
        description: redactedDescription,
        original_description: data.description,
      };

      // 1. Create the report first
      const report = await db.createReport(reportData);

      // 2. Upload evidence files if any
      if (selectedFiles.length > 0) {
        try {
          await db.uploadEvidence(selectedFiles, report.id);
        } catch (error) {
          console.error('Error uploading evidence:', error);
          toast.error('Report submitted but some files failed to upload');
          // Continue with navigation since the report was created
        }
      }

      toast.success('Report submitted successfully! It will be reviewed before publication.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to submit report');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files were rejected. Only images and PDFs under 10MB are allowed.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const entityOptions = [
    { value: '', label: 'Select an entity...' },
    ...entities.map(entity => ({
      value: entity.id,
      label: `${entity.name} (${entity.type})`
    })),
    { value: 'new', label: '+ Add New Entity' }
  ];

  // Define category options based on report type
  const categoryOptions = reportType ? [
    { value: '', label: 'Select a category...' },
    ...(['positive', 'negative'].includes(reportType) 
      ? [
          { value: 'service', label: 'Service' },
          { value: 'quality', label: 'Quality' },
          { value: 'communication', label: 'Communication' },
          { value: 'reliability', label: 'Reliability' },
          { value: 'other', label: 'Other' }
        ]
      : []
    )
  ] : [{ value: '', label: 'Select report type first...' }];

  const entityCategoryOptions = entityReportType ? [
    { value: '', label: 'Select a category...' },
    ...reportCategories[entityReportType].map(cat => ({ value: cat, label: cat }))
  ] : [{ value: '', label: 'Select report type first...' }];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit a Report</h1>
          <p className="text-gray-600">
            Share your experience about a company or individual. All reports are reviewed before publication.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Entity Selection */}
            <Select
              label="Entity *"
              {...register('entity_id', { required: 'Please select an entity' })}
              options={entityOptions}
              error={errors.entity_id?.message}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  // Preserve current form data before opening modal
                  const currentData = {
                    title: watch('title'),
                    description: watch('description'),
                    is_anonymous: watch('is_anonymous')
                  };
                  setPreservedFormData(currentData);
                  setNewEntityReportType(watch('type') || '');
                  setShowNewEntityModal(true);
                  setValue('entity_id', '');
                } else {
                  setValue('entity_id', e.target.value);
                }
              }}
            />

            {/* Report Type */}
            <Select
              label="Report Type *"
              {...register('type', {
                required: 'Please select a report type'
              })}
              value={watch('type') || ''}
              onChange={(e) => {
                const value = e.target.value as 'positive' | 'negative' | '';
                if (value === 'positive' || value === 'negative') {
                  setValue('type', value);
                }
                setValue('category', '');
              }}
              options={[
                { value: '', label: 'Select report type...' },
                { value: 'positive', label: 'Positive Experience' },
                { value: 'negative', label: 'Negative Experience' }
              ]}
              error={errors.type?.message}
              onChange={(e) => {
                setValue('type', e.target.value as 'positive' | 'negative');
                setValue('category', ''); // Reset category when report type changes
              }}
            />

            {/* Category */}
            <Select
              label="Category *"
              {...register('category', { 
                required: 'Please select a category'
              })}
              value={watch('category') || ''}
              onChange={(e) => {
                setValue('category', e.target.value);
              }}
              options={categoryOptions}
              error={errors.category?.message}
              disabled={!reportType}
              onChange={(e) => {
                setValue('category', e.target.value);
              }}
            />

            {/* Title */}
            <Input
              label="Title *"
              placeholder="Brief summary of your experience"
              {...register('title', { 
                required: 'Title is required',
                maxLength: { value: 100, message: 'Title must be less than 100 characters' }
              })}
              error={errors.title?.message}
            />

            {/* Description */}
            <TextArea
              label="Description *"
              placeholder="Provide detailed information about your experience..."
              rows={6}
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 50, message: 'Description must be at least 50 characters' },
                validate: value => {
                  if (!value) return 'Description is required';
                  if (value.length < 50) return 'Description must be at least 50 characters';
                  return true;
                }
              })}
              error={errors.description?.message}
              onChange={(e) => {
                setValue('description', e.target.value, { shouldValidate: true });
              }}
            />

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload supporting documents or images
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload">
                    <Button type="button" variant="outline" size="sm" as="span">
                      Choose Files
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 5 files, 10MB each. Images and PDFs only.
                  </p>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                {...register('is_anonymous')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Submit anonymously (your identity will not be shown publicly)
              </label>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy & Moderation</p>
                  <p>
                    Your report will be automatically scanned for sensitive information (phone numbers, emails, etc.) 
                    and reviewed by our moderation team before publication. The entity will have the right to respond.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Submit Report
              </Button>
            </div>
          </form>
        </div>

        {/* New Entity Modal */}
        <Modal
          isOpen={showNewEntityModal}
          onClose={() => {
            setShowNewEntityModal(false);
            setPreservedFormData({});
            setNewEntityReportType('');
          }}
          title="Add New Entity"
        >
          <form onSubmit={handleSubmitEntity(createNewEntity)} className="space-y-4">
            <Select
              label="Report Type *"
              value={watchEntity('reportType') || ''}
              onChange={(e) => {
                setEntityValue('reportType', e.target.value as 'positive' | 'negative');
                setEntityValue('category', ''); // Reset category when report type changes
              }}
              options={[
                { value: '', label: 'Select report type...' },
                { value: 'positive', label: 'Positive Experience' },
                { value: 'negative', label: 'Negative Experience' }
              ]}
              error={entityErrors.reportType?.message}
            />

            <Select
              label="Category *"
              {...registerEntity('category', { required: 'Category is required' })}
              options={entityCategoryOptions}
              error={entityErrors.category?.message}
              disabled={!entityReportType}
              onChange={(e) => {
                setEntityValue('category', e.target.value);
              }}
            />

            <Input
              label="Name *"
              placeholder="Entity name"
              {...registerEntity('name', { required: 'Name is required' })}
              error={entityErrors.name?.message}
            />

            <Select
              label="Type *"
              value={watchEntity('type') || ''}
              onChange={(e) => setEntityValue('type', e.target.value as 'company' | 'individual')}
              options={[
                { value: '', label: 'Select type...' },
                { value: 'company', label: 'Company' },
                { value: 'individual', label: 'Individual' }
              ]}
              error={entityErrors.type?.message}
            />

            <Input
              label="Location"
              placeholder="City, Region"
              {...registerEntity('location')}
            />

            <TextArea
              label="Description"
              placeholder="Brief description of the entity"
              rows={3}
              {...registerEntity('description')}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewEntityModal(false);
                  setPreservedFormData({});
                  setNewEntityReportType('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Entity
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}