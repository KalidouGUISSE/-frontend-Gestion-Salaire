import client from './client.js'

export const attendanceApi = {
  scan: (data) => client.post('attendance/scan', {
    qrData: data.qrData || data.qrToken, // Support both old and new format
    deviceId: data.deviceId,
  }),

  getTodayAttendance: (employeeId) => client.get(`attendance/today/${employeeId}`),

  getReport: (params) => client.get('attendance/report', { params }),

  exportReport: (params) => client.get('attendance/export', {
    params,
    responseType: 'blob',
  }),

  getWorkingHours: (params) => client.get('attendance/hours', { params }),
}
