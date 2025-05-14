import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.prefillEmail) { // Prefills email if present
            setEmail(location.state.prefillEmail);
        }
    }, [location.state]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const body = new URLSearchParams();
            body.append('username', email);
            body.append('password', password);

            const response = await fetch('http://localhost:8000/users/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            
            // Needs to be reworked into a cookie
            localStorage.setItem('token', data.access_token);
        

            setSuccess(data.message || 'Erfolgreich eingeloggt!');
        
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login fehlgeschlagen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
                maxWidth: '400px', 
                margin: '2rem auto', 
                padding: '2rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
            }}
        >
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}
            
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Passwort:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Loggt ein...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                Noch kein Konto? <Link to="/signup" style={{ color: '#007bff' }}>Registrieren</Link>
            </div>
        </div>
    );
};

export default Login;