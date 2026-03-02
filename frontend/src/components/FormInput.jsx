export default function FormInput({ label, type, name, placeholder, value, onChange }) {
  const inputClasses = "block w-full p-2.5 pl-10 text-sm text-white border border-[#383838] bg-[#171717] placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent transition-all duration-200";

  return (
    <>
      {label && (
        <label htmlFor={name} className="block mb-1.5 text-sm font-medium text-[#858585]">
          {label}
        </label>
      )}
      <input
        id={name}
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