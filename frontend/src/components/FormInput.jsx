export default function FormInput({ label, type, name, placeholder, value, onChange }) {
   const inputClasses = "block w-full p-2.5 pl-10 text-sm text-gray-900 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent transition-all duration-200";

  return (
    <>
      <label className="text-sm font-bold">{label}</label>
      <input
        className={inputClasses}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
}