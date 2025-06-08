export default function SuperAdminCard() {
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Super Admin</h2>
        <p className="text-gray-700 mb-4">
          As a Super Admin, you have full control over the system. You can manage president, division heads, users, settings, and all aspects of the application.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Add or remove President, division head or member.</li>
          <li>Configure system settings.</li>
          <li>Access all data and reports.</li>
          <li>Manage user roles and permissions.</li>
          <li>Monitor system performance and security.</li>
          <li>Perform system backups and maintenance.</li>
        </ul>
      </div>
    </div>
  )
}