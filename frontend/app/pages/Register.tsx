import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            navigate("/");

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

  return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex items-center pl-4 border-b shrink-0">
                <h1 className="text-xl font-light">Register</h1>
            </div>

            <main className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                <div className="w-full max-w-md border border-brown rounded-lg p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-md text-center">
                        {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-brown rounded-md text-sm"
                                placeholder="joern.steffen@ksb-sg.ch"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Passwort</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-brown rounded-md text-sm"
                                placeholder="einsehrs1cheresP@sswort"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-brown text-white border border-brown rounded-md hover:bg-white hover:text-brown transition"
                            >
                            {loading ? 'Verarbeitet...' : 'Register'}
                        </button>
                    </form>

                    <div className="text-sm text-center text-gray-600 pt-2">
                            Already have an account?{' '}
                        <a href="/login" className="text-brown font-medium hover:underline">
                            Login
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Signup;