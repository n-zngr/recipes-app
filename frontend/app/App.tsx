import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import { Home, Plus, Edit, Settings, Trash2 } from "lucide-react";
import recipe_book from "./assets/recipe-book.svg";

interface Recipe {
    id: number;
    title: string;
    ingredients: string[]
    instructions: string;
}

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [isAddingIngredient, setIsAddingIngredient] = useState<boolean>(false);
    const ingredientInputRef = useRef<HTMLInputElement>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const householdId = "sl1cdzSAbdpV7eBVOoHv";

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/households/${householdId}/ingredients`);
                const data = await response.json();
                if (response.ok) {
                    setIngredients(data.ingredients.map((i: any) => i.name));
                } else {
                    console.error('Error fetching ingredients:', data);
                }
            } catch (err) {
                console.error("Fehler beim Laden der Zutaten:", err);
            }
        };

        fetchIngredients();
    }, []);

    useEffect(() => {
        if (isAddingIngredient && ingredientInputRef.current) {
            ingredientInputRef.current.focus();
        }
    }, [isAddingIngredient]);

    const handleShowInput = () => {
        setIsAddingIngredient(true);
        setNewIngredient('');
    };

    const handleNewIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewIngredient(e.target.value);
    };

    // Zutat speichern (POST)
    const commitNewIngredient = async () => {
        const trimmedIngredient = newIngredient.trim();
        if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
            try {
                const response = await fetch(`http://localhost:8000/api/households/${householdId}/ingredients`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: trimmedIngredient,
                        quantity: '1 Stück'
                    })
                });

                if (response.ok) {
                    setIngredients(prev => [...prev, trimmedIngredient]);
                } else {
                    console.error('Fehler beim Hinzufügen der Zutat:', await response.json());
                }
            } catch (error) {
                console.error('Netzwerkfehler beim POST:', error);
            }
        }
        setNewIngredient('');
        setIsAddingIngredient(false);
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitNewIngredient();
        } else if (e.key === 'Escape') {
            setNewIngredient('');
            setIsAddingIngredient(false);
        }
    };

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            if (isAddingIngredient) {
                commitNewIngredient();
            }
        }, 150);
    };

    return (
        <div className="flex flex-col h-screen bg-white text-brown border-brown/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex gap-4 items-center pl-4 border-b shrink-0">
                <div className="pt-1">
                    <Home size="24px" strokeWidth={1}/>
                </div>
                <h1 className="font-light">Household</h1>
                <Settings className="ml-auto mr-4" size="24px" strokeWidth={1} />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 flex flex-col ml-2 my-2 border rounded-lg">
                    <div className="flex shrink-0 items-center justify-between rounded-t-md bg-brown p-2 pb-2 text-white">
                        <h2 className="font-medium">Zutatenliste</h2>
                        <button
                            onClick={handleShowInput}
                            className="w-6 h-6 flex items-center justify-center bg-green hover:bg-white border border-brown/50 text-xl font-semibold text-white hover:text-brown rounded-sm transition-colors duration-200 focus:outline-none"
                            aria-label="Add new ingredient"
                        >
                            <Plus size="16px" />
                        </button>
                    </div>

                    {isAddingIngredient && (
                        <div className="shrink-0 px-2">
                            <input
                                type="text"
                                ref={ingredientInputRef}
                                value={newIngredient}
                                onChange={handleNewIngredientChange}
                                onKeyDown={handleInputKeyDown}
                                onBlur={handleInputBlur}
                                placeholder="Neue Zutat"
                                className="w-full px-2 py-2 mt-2 text-sm focus:ring-0 focus:outline-none transition-colors duration-200 border-b border-brown"
                            />
                        </div>
                    )}

                    <ul className="flex-grow space-y-2 overflow-y-auto p-2">
                        {ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className="group flex items-center justify-between px-2 py-2 text-sm border border-brown rounded-sm hover:shadow-sm shadow-brown/25 transition-all duration-200"
                            >
                                <p>{ingredient}</p>
                                <div className="flex items-center">
                                    <button className="text-brown hover:text-red-700 group-hover:opacity-100 group-hover:-translate-x-1 translate-x-4 opacity-0 transition-all duration-200">
                                        <Trash2 size="16px" />
                                    </button>
                                    <button className="text-brown hover:text-green-dark group-hover:opacity-100 opacity-0 transition-all duration-200">
                                        <Edit size="16px" />
                                    </button>
                                </div>
                            </li>
                        ))}
                        {ingredients.length === 0 && !isAddingIngredient && (
                            <div className="flex flex-col justify-center items-center">
                                <img className="p-4" src={recipe_book} alt="" />
                                <p className="mt-4 text-sm text-center">Füge deine erste Zutat hinzu.</p>
                            </div>
                        )}
                    </ul>
                </aside>

                <main className="flex-1 p-6 overflow-y-auto"> 
                    <div className="max-w-3xl mx-auto space-y-6">
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <div key={recipe.id} className="p-4 border border-brown rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <h3 className="pb-2 mb-3 text-2xl border-b border-brown">
                                        {recipe.title}
                                    </h3>
                                    <div className="mb-3">
                                        <strong className="block mb-1 text-xs font-medium tracking-wide text-brown uppercase">Key Ingredients:</strong>
                                        <p className="text-sm text-brown">{recipe.ingredients.join(', ')}</p>
                                    </div>
                                    <div>
                                        <strong className="block mb-1 text-xs font-medium tracking-wide text-brown uppercase">Method:</strong>
                                        <p className="text-sm leading-relaxed text-brown">{recipe.instructions}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-8 text-center text-lg font-medium">Füge Zutaten deiner Liste hinzu, um Rezepte anzusehen.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
