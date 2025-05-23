import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';

const Onboarding: React.FC = () => {
    const [householdName, setHouseholdName] = useState('');
    const [userEmails, setUserEmails] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const addEmail = () => {
        if (newEmail && !userEmails.includes(newEmail)) {
            setUserEmails([...userEmails, newEmail]);
            setNewEmail('');
        }
    };

    const removeEmail = (email: string) => {
        setUserEmails(userEmails.filter(e => e !== email));
    }

    const handleSubmit = async () => {
        if (!householdName) return;

        try {
            const response = await fetch('http://localhost:8000/api/households/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ name: householdName, member_emails: userEmails })
            });

            if (response.ok) {
                navigate(`/`);
            } else {
                alert('Failed to create household: Line 40 Onboarding.tsx');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network Error occurred, failed to connect to API');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex items-center pl-4 border-b shrink-0">
                <h1 className="text-xl font-light">Onboarding</h1>
            </div>

            <main className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
                <div className="w-full max-w-md border border-brown rounded-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Haushaltsname</label>
                        <input
                            type="text"
                            value={householdName}
                            onChange={e => setHouseholdName(e.target.value)}
                            className="w-full px-3 py-2 border border-brown rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Mitglieder (Email)</label>
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="email"
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addEmail()}
                                className="flex-1 px-3 py-2 border border-brown rounded-md text-sm"
                            />
                            <button
                                onClick={addEmail}
                                className="w-9 h-9 flex items-center justify-center bg-green text-white border border-brown rounded-md"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <ul className="space-y-2">
                        {userEmails.map((email, idx) => (
                            <li key={idx} className="flex items-center justify-between px-3 py-2 border border-brown rounded-md text-sm">
                                <span>{email}</span>
                                <button
                                    onClick={() => removeEmail(email)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 text-center bg-brown text-white border border-brown rounded-md hover:bg-white hover:text-brown transition"
                    >
                        Haushalt erstellen
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Onboarding;