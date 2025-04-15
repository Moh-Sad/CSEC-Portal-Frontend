import { LuExternalLink } from "react-icons/lu";

export function Resources() {
  const resources = [
    {
      name: "Data science & AI challenges",
      link: "https://googlecodejam.com/challenges",
    },
    {
      name: "Math-based programming problems",
      link: "https://googlecodejam.com/challenges",
    },
    {
      name: "Cybersecurity & hacking challenges",
      link: "https://googlecodejam.com/challenges",
    },
    {
      name: "Smart contract security challenges",
      link: "https://googlecodejam.com/challenges",
    },
    {
      name: "CP contests for beginners & intermediates",
      link: "https://googlecodejam.com/challenges",
    },
  ];

  return (
    <div className="flex flex-col my-8">
      <div className="flex space-y-2">
        <span className="w-86 text-sm font-medium text-gray-500">
          Resource Name
        </span>
        <span className="text-sm font-medium text-gray-500">Link</span>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex gap-2">
          <span className="font-medium w-95">Data science & AI challenges</span>
          <span className=" font-medium w-100">
            https://googlecodejam.com/challenges
          </span>
          <a href="http://https://googlecodejam.com/challenges" target="_blank">
            <LuExternalLink />
          </a>
        </div>
        <div className="flex justify-between">
          <span className="font-medium w-95">
            Math-based programming problems
          </span>
          <span className="font-medium w-100">
            https://googlecodejam.com/challenges
          </span>
          <a href="http://https://googlecodejam.com/challenges" target="_blank">
            <LuExternalLink />
          </a>
        </div>
        <div className="flex justify-between">
          <span className="font-medium w-95">
            Cybersecurity & hacking challenges
          </span>
          <span className=" font-medium w-100">
            https://googlecodejam.com/challenges
          </span>
          <a href="http://https://googlecodejam.com/challenges" target="_blank">
            <LuExternalLink />
          </a>
        </div>
        <div className="flex justify-between">
          <span className="font-medium w-95">
            Smart contract security challenges
          </span>
          <span className=" font-medium w-100">
            https://googlecodejam.com/challenges
          </span>
          <a href="http://https://googlecodejam.com/challenges" target="_blank">
            <LuExternalLink />
          </a>
        </div>
        <div className="flex justify-between">
          <span className="font-medium w-95">
            CP contests for beginners & intermediates
          </span>
          <span className=" font-medium w-100">
            https://googlecodejam.com/challenges
          </span>
          <a href="http://https://googlecodejam.com/challenges" target="_blank">
            <LuExternalLink />
          </a>
        </div>
      </div>
    </div>
  );
}
