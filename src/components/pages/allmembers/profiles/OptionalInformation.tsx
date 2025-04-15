export function OptionalInformation() {
  return (
    <div>
      <div className="flex flex-wrap gap-8" style={{marginTop: "10px"}}>
        {/* Left Column */}
        <div className="flex-1 min-w-[250px] flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">
              University ID
            </span>
            <span className="text-gray-800 font-medium">Ugr/23456/14</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              LinkedIn Account
            </span>
            <a
              href="https://linkedin.com/henokassefa/profile"
              className="text-blue-600 hover:underline font-medium"
            >
              linkedin.com/henokassefa/profile
            </a>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Codeforces Handle
            </span>
            <a
              href="https://codeforces/hena_bakos"
              className="text-blue-600 hover:underline font-medium"
            >
              codeforces/hena_bakos
            </a>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Leetcode Handle
            </span>
            <a
              href="https://leetcode/Hena_bakos"
              className="text-blue-600 hover:underline font-medium"
            >
              leetcode/Hena_bakos
            </a>
            <div className="w-full border-b border-gray-300"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 min-w-[250px] flex flex-col gap-4">
          <div className="flex flex-col gap-1 my-5">
            <span className="text-sm font-medium text-gray-500">
              Instagram Handle
            </span>
            <span className="text-gray-800 font-medium">@hena_man</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Birth Date
            </span>
            <span className="text-gray-800 font-medium">Mar 28, 2002</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">CV</span>
            <a
              href="https://github.com/Henabakos/Admin-edstelar"
              className="text-blue-600 hover:underline font-medium"
            >
              github.com/Henabakos/Admin-edstelar
            </a>
            <div className="w-full border-b border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-1" style={{ marginBottom: "20px" }}>
            <span className="text-sm font-medium text-gray-500">
              Joining Date
            </span>
            <span className="text-gray-800 font-medium">July 10, 2023</span>
            <div className="w-full border-b border-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Full width section for Short Bio */}
      <div className="mt-6">
        <div className="flex flex-col gap-1" style={{ marginBottom: "30px" }}>
          <span className="text-sm font-medium text-gray-500">Short Bio</span>
          <p className="text-gray-800 font-medium">
            I am a full-stack developer and UI/UX designer with a strong
            background in Next.js, React, Tailwind CSS, Redux Toolkit, and
            ShadCN on the frontend, as well as Node.js, Express, Prisma, and
            databases like MongoDB & PostgreSQL on the backend. I have
            experience developing high-performance web applications, focusing on
            clean architecture, scalability, and modern UI/UX principles.
          </p>
        </div>
      </div>
    </div>
  );
}
