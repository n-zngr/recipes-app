import { Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<{ id: string, email: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const checkAdminAndFetchUsers = async () => {
        try {
            const authResponse = await fetch('http://localhost:8000/api/households/admin', {
                credentials: 'include'
            });

            const authData = await authResponse.json();
            if (!authData.authorized) {
                navigate('/');
                return;
            }

            const userResponse = await fetch('http://localhost:8000/api/households/users', {
                credentials: 'include'
            });

            const userData = await userResponse.json();
            setUsers(userData.users);
        } catch (error) {
            console.error('Error fetching data', error);
            navigate('/')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAdminAndFetchUsers();
    }, []);

    return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex gap-4 items-center pl-4 border-b shrink-0">
                <div className="pt-1">
                    <Home size="24px" strokeWidth={1} />
                </div>
                <h1 className="font-light">Admin Panel</h1>
            </div>
            <div className="p-6 overflow-y-auto">
                {loading ? (
                    <p className="text-center">Lädt...</p>
                ) : (
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-xl mb-4 font-semibold">Mitglieder im Haushalt</h2>
                        <ul className="space-y-3">
                            {users.map((user) => (
                                <li key={user.id} className="border border-brown p-3 rounded-md">
                                    <p className="text-sm">{user.email}</p>
                                    <p className="text-xs text-gray-500">User ID: {user.id}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin;