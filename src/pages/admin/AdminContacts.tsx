import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Reply, Archive, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Modal } from '../../components/ui/Modal';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  created_at: string;
  replied_at?: string;
}

export function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Question about report moderation',
      message: 'Hi, I submitted a report last week and it\'s still pending. Can you please check the status?',
      status: 'new',
      created_at: '2024-03-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Feature request',
      message: 'It would be great to have email notifications when someone replies to my reports.',
      status: 'replied',
      created_at: '2024-03-19T14:15:00Z',
      replied_at: '2024-03-19T16:30:00Z'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      subject: 'Technical issue',
      message: 'I\'m having trouble uploading evidence files. The upload keeps failing.',
      status: 'new',
      created_at: '2024-03-18T09:45:00Z'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    return statusFilter === 'all' || contact.status === statusFilter;
  });

  const handleReply = () => {
    if (!selectedContact || !replyMessage.trim()) return;

    setContacts(prev => prev.map(contact => 
      contact.id === selectedContact.id 
        ? { ...contact, status: 'replied' as const, replied_at: new Date().toISOString() }
        : contact
    ));

    setShowReplyModal(false);
    setReplyMessage('');
    setSelectedContact(null);
  };

  const handleStatusChange = (contactId: string, newStatus: 'new' | 'replied' | 'archived') => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId ? { ...contact, status: newStatus } : contact
    ));
  };

  const handleDelete = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact message?')) {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage user inquiries and support requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{contacts.length}</p>
              <p className="text-gray-600">Total Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {contacts.filter(c => c.status === 'new').length}
              </p>
              <p className="text-gray-600">New Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Reply className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {contacts.filter(c => c.status === 'replied').length}
              </p>
              <p className="text-gray-600">Replied</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Archive className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {contacts.filter(c => c.status === 'archived').length}
              </p>
              <p className="text-gray-600">Archived</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{contact.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{contact.subject}</h4>
                  <p className="text-sm text-gray-700 mb-3">{contact.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                    {contact.replied_at && (
                      <span>Replied: {new Date(contact.replied_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowReplyModal(true);
                    }}
                  >
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange(contact.id, 'archived')}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setReplyMessage('');
          setSelectedContact(null);
        }}
        title="Reply to Message"
      >
        {selectedContact && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Original Message</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>From:</strong> {selectedContact.name} ({selectedContact.email})
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {selectedContact.subject}
              </p>
              <p className="text-sm text-gray-700">{selectedContact.message}</p>
            </div>
            
            <TextArea
              label="Your Reply"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={6}
              placeholder="Type your reply here..."
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                  setSelectedContact(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={!replyMessage.trim()}>
                <Reply className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}