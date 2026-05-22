import { query } from './db.js';

/**
 * Enregistre une ligne dans audit_logs (admin back-office).
 */
export async function auditLog({
  adminId = null,
  action,
  tableName = null,
  recordId = null,
  oldValue = null,
  newValue = null,
  ipAddress = null,
}) {
  try {
    await query(
      `INSERT INTO audit_logs (admin_id, action, table_name, record_id, old_value, new_value, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        String(action || '').slice(0, 100),
        tableName ? String(tableName).slice(0, 60) : null,
        recordId != null ? Number(recordId) : null,
        oldValue != null ? JSON.stringify(oldValue) : null,
        newValue != null ? JSON.stringify(newValue) : null,
        ipAddress ? String(ipAddress).slice(0, 45) : null,
      ]
    );
  } catch (err) {
    console.error('auditLog error:', err);
  }
}
