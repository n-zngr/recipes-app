import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/onboarding')
            }, 1000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex items-center pl-4 border-b shrink-0">
                <h1 className="text-xl font-light">Login</h1>
            </div>

            <main className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                <div className="w-full max-w-md border border-brown rounded-lg p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green text-white text-sm px-4 py-2 rounded-md text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-brown rounded-md text-sm"
                                placeholder="Enter your email"
                            />
                            </div>

                            <div>
                            <label className="block text-sm mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-brown rounded-md text-sm"
                                placeholder="Enter your password"
                            />
                            </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-brown text-white border border-brown rounded-md hover:bg-white hover:text-brown transition"
                            >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-sm text-center text-gray-600 pt-2">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-brown font-medium hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
