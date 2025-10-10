import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ContactForm from "@/components/organisms/ContactForm";
import ContactDetail from "@/components/organisms/ContactDetail";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";
import { format } from "date-fns";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactService.delete(contactId);
      toast.success("Contact deleted successfully!");
      loadContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedContact(null);
    loadContacts();
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
          <p className="text-secondary">Manage your customer relationships</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="UserPlus" size={16} />
          Add Contact
        </Button>
      </div>

      <Card className="p-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search contacts by name, email, or company..."
        />
      </Card>

      {filteredContacts.length === 0 ? (
        <Empty
          icon="Users"
          title={searchQuery ? "No contacts found" : "No contacts yet"}
          message={searchQuery ? "Try adjusting your search" : "Add your first contact to get started"}
          actionLabel="Add Contact"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => handleViewContact(contact)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {contact.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditContact(contact);
                      }}
                      className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.Id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{contact.name}</h3>
                    <p className="text-sm text-secondary">{contact.title}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <ApperIcon name="Building2" size={14} />
                      <span className="truncate">{contact.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <ApperIcon name="Mail" size={14} />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <ApperIcon name="Phone" size={14} />
                      <span>{contact.phone}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-secondary">
                      Added {format(new Date(contact.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Contact"
        size="md"
      >
        <ContactForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        size="md"
      >
        <ContactForm
          contact={selectedContact}
          onSuccess={handleModalSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedContact(null);
        }}
        title="Contact Details"
        size="lg"
      >
        {selectedContact && (
          <ContactDetail
            contact={selectedContact}
            onEdit={() => handleEditContact(selectedContact)}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedContact(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Contacts;