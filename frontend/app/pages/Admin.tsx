import { Home, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [owner, setOwner] = useState<{ id: string, email: string } | null>(null);
    const [admins, setAdmins] = useState<{ id: string, email: string }[]>([]);
    const [members, setMembers] = useState<{ id: string, email: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAndFetch = async () => {
            try {
                const authResponse = await fetch('http://localhost:8000/api/households/admin', {
                    credentials: 'include'
                });

                const authData = await authResponse.json();
                if (!authData.authorized) {
                    navigate('/');
                    return;
                }

                const response = await fetch('http://localhost:8000/api/households/users', {
                    credentials: 'include'
                });

                const data = await response.json();
                setOwner(data.owner);
                setAdmins(data.admins);
                setMembers(data.members);
            } catch (error) {
                console.error('Error authenticating or fetching users:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAndFetch();
    }, [navigate]);

    const promoteUser = async (userId: string) => {
        await fetch('http://localhost:8000/api/households/promote', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        refreshUsers();
    };

    const demoteUser = async (userId: string) => {
        await fetch('http://localhost:8000/api/households/demote', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        refreshUsers();
    }

    const removeUser = async (userId: string) => {
        await fetch('http://localhost:8000/api/households/remove', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })    
        })
        refreshUsers();
    }

    const refreshUsers = async () => {
        const response = await fetch('http://localhost:8000/api/households/users', {
            credentials: 'include'
        });
        const data = await response.json();
        setOwner(data.owner);
        setAdmins(data.admins);
        setMembers(data.members);
    };

    return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex gap-4 items-center pl-4 border-b shrink-0">
                <div className="pt-1">
                    <Home size="24px" strokeWidth={1} />
                </div>
                <h1 className="font-light">Household Admin</h1>
            </div>

            <div className="p-6 overflow-y-auto">
                {loading ? (
                    <p className="text-center">Authenticating...</p>
                ) : (
                    <div className="max-w-xl mx-auto space-y-8">

                        {/* Owner */}
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Owner</h2>
                            {owner && (
                                <ul>
                                    <li key={owner.id} className="flex items-center justify-between border border-brown p-3 rounded-md">
                                        <div>
                                            <p className="text-sm">{owner.email}</p>
                                            <p className="text-xs text-gray-500">{owner.id}</p>
                                        </div>
                                        <span className="text-xs text-yellow-600">
                                            <Crown size={20} />
                                        </span>
                                    </li>
                                </ul>
                            )}
                        </section>

                        {/* Admins */}
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Admins</h2>
                            <ul className="space-y-2">
                                {admins.map((admin) => (
                                    <li key={admin.id} className="flex items-center justify-between border border-brown p-3 rounded-md">
                                        <div>
                                            <p className="text-sm">{admin.email}</p>
                                            <p className="text-xs text-gray-500">{admin.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => demoteUser(admin.id)}
                                                className="text-yellow-600 text-xs border px-2 py-1 rounded-md"
                                            >
                                                Demote
                                            </button>
                                            <button
                                                onClick={() => removeUser(admin.id)}
                                                className="text-red-600 text-xs border px-2 py-1 rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Members */}
                        <section>
                            <h2 className="text-xl font-semibold mb-2">Members</h2>
                            <ul className="space-y-2">
                                {members.map((member) => (
                                    <li key={member.id} className="flex items-center justify-between border border-brown p-3 rounded-md">
                                        <div>
                                            <p className="text-sm">{member.email}</p>
                                            <p className="text-xs text-gray-500">{member.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => promoteUser(member.id)}
                                                className="text-green-600 text-xs border px-2 py-1 rounded-md"
                                            >
                                                Promote
                                            </button>
                                            <button
                                                onClick={() => removeUser(member.id)}
                                                className="text-red-600 text-xs border px-2 py-1 rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin;