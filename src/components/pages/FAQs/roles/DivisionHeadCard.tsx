export default function DivisionHeadCard() {
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Division Head</h2>
        <p className="text-gray-700 mb-4">
          As a Division head, you have intermidate control over the system. You can manage
          your division members, settings, and many aspects of the application.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Add a member to your division.</li>
          <li>Add or remove groups in your division.</li>
          <li>Invite a member to your division.</li>
          <li>Access Attendance Page</li>
          <li>Create Sessions & Events</li>
          <li>Add resources to your division</li>
          <li>Manage your division attendance and headsup.</li>
        </ul>
      </div>
    </div>
  );
}
