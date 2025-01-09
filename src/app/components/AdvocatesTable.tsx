import { Advocate } from "../shared/types";

type AdvocatesTableProps = {
  advocates: Advocate[];
};

export const AdvocatesTable = ({ advocates }: AdvocatesTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">
            First Name
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Last Name
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">City</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Degree</th>
          <th className="border border-gray-300 px-4 py-2 text-left hidden md:table-cell">
            Specialties
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left">
            Years of Experience
          </th>
          <th className="border border-gray-300 px-4 py-2 text-left hidden sm:table-cell">
            Contact
          </th>
        </tr>
      </thead>
      <tbody>
        {advocates.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              className="border border-gray-300 px-4 py-6 text-center text-gray-600"
            >
              No advocates found.
            </td>
          </tr>
        ) : (
          advocates.map((advocate) => (
            <tr
              key={advocate.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="border border-gray-300 px-4 py-2">
                {advocate.firstName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.city}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.degree}
              </td>
              <td className="border border-gray-300 px-4 py-2 hidden md:table-cell">
                {advocate.specialties.join(", ")}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {advocate.yearsOfExperience}
              </td>
              <td className="border border-gray-300 px-4 py-2 hidden sm:table-cell">
                {advocate.phoneNumber}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
