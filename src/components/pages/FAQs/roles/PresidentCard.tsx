export default function PresidentCard() {
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">President</h2>
        <p className="text-gray-700 mb-4">
          As a President, you have major control over the system. You can manage
          division heads, members, settings, and much aspects of the application.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Add or remove division head or member.</li>
          <li>Add or remove division.</li>
          <li>Invite a member or division head.</li>
          <li>Access Administration Page</li>
        </ul>
      </div>
    </div>
  );
}
