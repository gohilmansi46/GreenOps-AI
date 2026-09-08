import { useState } from "react";
import { changePassword, formatAuthError } from "../services/authService";
import { FaCheckCircle } from "react-icons/fa";
import { FaLock, FaEye, FaEyeSlash, FaXmark, FaShieldHalved } from "react-icons/fa6";
import toast from "react-hot-toast";

function ChangePasswordModal({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(formatAuthError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
        >
          <FaXmark size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300 flex items-center justify-center font-bold text-xl shrink-0">
            <FaShieldHalved />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">
              Change Account Password
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update your account password for enhanced security.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (min. 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:border-green-500 outline-none transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full pl-12 pr-12 py-3 rounded-xl border ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-400 bg-red-50/20"
                    : confirmPassword && newPassword === confirmPassword
                    ? "border-green-500 bg-green-50/20"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                } text-gray-900 dark:text-white outline-none transition text-sm`}
              />
              {confirmPassword && newPassword === confirmPassword && (
                <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
