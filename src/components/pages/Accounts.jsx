import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import AccountForm from "@/components/organisms/AccountForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import accountService from "@/services/api/accountService";
import { format } from "date-fns";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountService.getAll();
      setAccounts(data);
    } catch (err) {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;

    try {
      await accountService.delete(accountId);
      toast.success("Account deleted successfully!");
      loadAccounts();
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const handleModalSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedAccount(null);
    loadAccounts();
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (account.tags && account.tags.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAccounts} />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts</h1>
          <p className="text-secondary">Manage your business accounts</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Building2" size={16} />
          Add Account
        </Button>
      </div>

      <Card className="p-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search accounts by name, email, or tags..."
        />
      </Card>

      {filteredAccounts.length === 0 ? (
        <Empty
          icon="Building2"
          title={searchQuery ? "No accounts found" : "No accounts yet"}
          message={searchQuery ? "Try adjusting your search" : "Add your first account to get started"}
          actionLabel="Add Account"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccounts.map((account, index) => (
            <motion.div
              key={account.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-green-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {account.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <ApperIcon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(account.Id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{account.name}</h3>
                    {account.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {account.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <ApperIcon name="Mail" size={14} />
                      <span className="truncate">{account.email}</span>
                    </div>
                    {account.phone && (
                      <div className="flex items-center gap-2 text-sm text-secondary">
                        <ApperIcon name="Phone" size={14} />
                        <span>{account.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-secondary">
                      Added {format(new Date(account.createdAt), "MMM d, yyyy")}
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
        title="Create New Account"
        size="md"
      >
        <AccountForm
          onSuccess={handleModalSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Account"
        size="md"
      >
        <AccountForm
          account={selectedAccount}
          onSuccess={handleModalSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Accounts;