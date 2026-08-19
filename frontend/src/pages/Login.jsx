import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;