import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Es mejor usar el hook personalizado

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Usamos el hook useAuth para obtener las funciones y estados correctos
  const { register, loading } = useAuth(); // Nombres correctos: 'register' y 'loading'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // La función register del contexto ya se encarga de todo
    await register(formData);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-slate-400">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-400">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-500"
            disabled={loading} // Usar 'loading'
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-sm text-center text-slate-400 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-sky-500 hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

