const DEPARTMENTS = [
  "Agriculture",
  "Applied Chemistry and Chemical Engineering (ACCE)",
  "Applied Mathematics",
  "Bangla",
  "Biochemistry and Molecular Biology (BMB)",
  "Biotechnology and Genetic Engineering (BGE)",
  "Business Administration (DBA)",
  "Chemistry",
  "Computer Science and Telecommunication Engineering (CSTE)",
  "Economics",
  "Education",
  "Educational Administration",
  "Electrical and Electronic Engineering (EEE)",
  "English",
  "Environmental Science and Disaster Management (ESDM)",
  "Fisheries and Marine Science (FIMS)",
  "Food Technology and Nutrition Science (FTNS)",
  "Information and Communication Engineering (ICE)",
  "Information Sciences and Library Management",
  "Law",
  "Management Information Systems (MIS)",
  "Microbiology",
  "Oceanography",
  "Pharmacy",
  "Physics",
  "Political Science",
  "Social Work",
  "Sociology",
  "Software Engineering Program",
  "Soil, Water and Environmental Sciences",
  "Statistics",
  "Tourism and Hospitality Management (THM)",
  "Zoology",
];

export default function DepartmentSelect({ value, onChange, className, required = false }) {
  const hasLegacyValue = value && !DEPARTMENTS.includes(value);
  return (
    <select className={className} name="department" onChange={onChange} required={required} value={value}>
      <option value="">Select department</option>
      {hasLegacyValue && <option value={value}>{value}</option>}
      {DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
    </select>
  );
}
