export default function FormInput({ label, type, name, placeholder, value, onChange }) {
  return (
    <>
      <label className="text-sm font-bold">{label}</label>
      <input
        className="mb-3 p-2 rounded-md border-2 border-gray-700 focus:outline-none text-white"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
}