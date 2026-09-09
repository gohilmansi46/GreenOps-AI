import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-sm sm:w-96">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;