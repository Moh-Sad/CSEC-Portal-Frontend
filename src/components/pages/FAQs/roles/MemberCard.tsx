export default function MemberCard() {
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Member</h2>
        <p className="text-gray-700 mb-4">
          As a member, you have minor control over the system. You can manage your own profile, settings, and some aspects of the application.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Change your profile.</li>
          <li>Manage your setting.</li>
          <li>Display others profile.</li>
          <li>Display coming events and sessions</li>
        </ul>
      </div>
    </div>
  );
}
