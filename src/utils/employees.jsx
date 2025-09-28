// src/utils/employees.js
export function getEmployeesFromResponse(apiResponse) {
  return apiResponse?.data?.data || []
}
