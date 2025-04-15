export function RequiredInformation() {
  return (
    <div>
      <div className="flex flex-wrap gap-8" style={{marginTop: "10px"}}>
        {/* Left Column */}
        <div className="flex-1 min-w-[250px] flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">
              First Name
            </span>
            <span className="text-gray-800 font-medium">Henok</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Mobile Number
            </span>
            <span className="text-gray-800 font-medium">
              (+251)-955-012-234
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Date of Birth
            </span>
            <span className="text-gray-800 font-medium">July 14, 1995</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">Gender</span>
            <span className="text-gray-800 font-medium">Male</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Expected Graduation Year
            </span>
            <span className="text-gray-800 font-medium">2026</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <span className="text-sm font-medium text-gray-500">
              Department
            </span>
            <span className="text-gray-800 font-medium">
              Computer Science And Engineering
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-[250px] flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">Last Name</span>
            <span className="text-gray-800 font-medium">Assefa</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Email Address
            </span>
            <span className="text-gray-800 font-medium">Henok@example.com</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">Github</span>
            <a
              href="https://github.com/henabakos"
              className="text-blue-600 hover:underline font-medium"
            >
              github.com/henabakos
            </a>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Telegram Handle
            </span>
            <span className="text-gray-800 font-medium">@henok_1</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Specialization
            </span>
            <span className="text-gray-800 font-medium">
              Full-stack development, UI/UX design
            </span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1 pb-5">
            <span className="text-sm font-medium text-gray-500">Mentor</span>
            <span className="text-gray-800 font-medium">Kiya Kebe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
