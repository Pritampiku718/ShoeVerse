import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiSave } from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'ShoeVerse',
    siteEmail: 'admin@shoeverse.com',
    currency: 'USD',
    taxRate: 10,
    shippingFee: 0,
    freeShippingThreshold: 100,
    enableReviews: true,
    enableWishlist: true,
    enableNewsletter: true,
    maintenanceMode: false
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <>
      <Helmet>
        <title>Settings - ShoeVerse Admin</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <form className="space-y-6">
            {/* General Settings */}
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Site Email</label>
                  <input
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => setSettings({...settings, siteEmail: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Currency & Tax */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Currency & Tax</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Fee ($)</label>
                  <input
                    type="number"
                    value={settings.shippingFee}
                    onChange={(e) => setSettings({...settings, shippingFee: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Features Toggle */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableReviews}
                    onChange={(e) => setSettings({...settings, enableReviews: e.target.checked})}
                    className="mr-3"
                  />
                  Enable Product Reviews
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableWishlist}
                    onChange={(e) => setSettings({...settings, enableWishlist: e.target.checked})}
                    className="mr-3"
                  />
                  Enable Wishlist
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableNewsletter}
                    onChange={(e) => setSettings({...settings, enableNewsletter: e.target.checked})}
                    className="mr-3"
                  />
                  Enable Newsletter
                </label>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Maintenance Mode</h2>
                  <p className="text-sm text-gray-500">When enabled, only admins can access the site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSave}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                <FiSave />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default Settings;