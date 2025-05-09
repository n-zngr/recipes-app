import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import { Home, Plus, Edit, Settings, Trash2 } from "lucide-react";

interface Recipe {
    id: number;
    title: string;
    ingredients: string[]
    instructions: string;
}

const placeholderRecipes: Recipe[] = [
    {
        id: 1,
        title: 'Spaghetti Carbonara',
        ingredients: ['Spaghetti', 'Large Eggs (yolks)', 'Pancetta or Guanciale', 'Pecorino Romano Cheese', 'Black Pepper'],
        instructions: 'Cook spaghetti until al dente. While pasta cooks, fry pancetta until crispy. In a bowl, whisk egg yolks, grated Pecorino Romano, and a generous amount of black pepper. Drain pasta, reserving some pasta water. Quickly combine hot pasta with pancetta in its rendered fat. Off heat, add egg mixture, stirring rapidly and continuously to create a creamy sauce (use reserved pasta water if too thick). Serve immediately, with extra cheese and pepper.',
    },
    {
        id: 2,
        title: 'Quick Chicken Stir-Fry',
        ingredients: ['Chicken Breast or Thighs', 'Broccoli Florets', 'Bell Peppers (various colors)', 'Soy Sauce', 'Ginger (minced)', 'Garlic (minced)', 'Sesame Oil', 'Cooked Rice (for serving)'],
        instructions: 'Cut chicken into bite-sized pieces. Chop broccoli and bell peppers. Mince ginger and garlic. Heat sesame oil in a wok or large skillet over medium-high heat. Add chicken and stir-fry until browned and cooked through. Add broccoli and bell peppers, stir-fry for 3-5 minutes until tender-crisp. Add ginger and garlic, cook for 1 minute until fragrant. Pour in soy sauce, toss to combine. Serve hot over cooked rice.',
    },
    {
        id: 3,
        title: 'Classic Fluffy Pancakes',
        ingredients: ['All-Purpose Flour', 'Milk', 'Large Egg', 'Granulated Sugar', 'Baking Powder', 'Salt', 'Melted Butter', 'Maple Syrup (for serving)'],
        instructions: 'In a large bowl, whisk together flour, sugar, baking powder, and salt. In a separate bowl, whisk together milk, egg, and melted butter. Pour wet ingredients into dry ingredients and whisk until just combined (a few lumps are okay, do not overmix). Heat a lightly oiled griddle or frying pan over medium heat. Pour or scoop batter onto the griddle, using approximately 1/4 cup for each pancake. Cook for 2-3 minutes per side, or until golden brown and bubbles appear on the surface. Serve warm with maple syrup and butter.',
    },
    {
        id: 4,
        title: 'Gourmet Avocado Toast',
        ingredients: ['Artisan Bread Slices (Sourdough or Whole Grain)', 'Ripe Avocados', 'Fresh Lemon Juice', 'Red Pepper Flakes', 'Everything Bagel Seasoning', 'Feta Cheese (crumbled, optional)', 'Microgreens (optional)', 'Poached Egg (optional)'],
        instructions: 'Toast bread slices to your desired crispiness. While toast is warm, mash avocados in a bowl with a fork. Stir in a squeeze of fresh lemon juice, salt, and freshly ground black pepper to taste. Spread avocado mixture evenly on the toast. Sprinkle generously with red pepper flakes and everything bagel seasoning. If desired, top with crumbled feta cheese, fresh microgreens, and/or a perfectly poached egg. Serve immediately for the best experience.',
    },
    {
        id: 5,
        title: 'Creamy Tomato Soup',
        ingredients: ['Canned San Marzano Tomatoes (whole or crushed)', 'Vegetable Broth', 'Yellow Onion', 'Garlic Cloves', 'Olive Oil', 'Dried Basil or Fresh Basil', 'Heavy Cream or Coconut Cream (for dairy-free)', 'Salt', 'Black Pepper', 'Croutons or Grilled Cheese (for serving)'],
        instructions: 'Finely chop onion and mince garlic. Heat olive oil in a large pot or Dutch oven over medium heat. Add onion and cook until softened, about 5-7 minutes. Add garlic and cook for another minute until fragrant. Pour in crushed tomatoes (or whole tomatoes, crushing them with a spoon) and vegetable broth. Add dried basil (if using fresh, add at the end), salt, and pepper. Bring to a simmer, then reduce heat, cover, and cook for at least 20-30 minutes to allow flavors to meld. For a smoother soup, use an immersion blender or carefully transfer in batches to a regular blender and blend until smooth. Return to pot if blended separately. Stir in heavy cream or coconut cream. Taste and adjust seasonings if necessary. Serve hot, garnished with fresh basil, croutons, or alongside a grilled cheese sandwich.',
    }
];


const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [isAddingIngredient, setIsAddingIngredient] = useState<boolean>(false)
    const ingredientInputRef = useRef<HTMLInputElement>(null);
    const [recipes, setRecipes] = useState<Recipe[]>(placeholderRecipes);
    
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

    const commitNewIngredient = () => {
        const trimmedIngredient = newIngredient.trim();
        if (trimmedIngredient) {
            if (!ingredients.includes(trimmedIngredient)) {
                setIngredients(prev => [...prev, trimmedIngredient]);
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
    }

    const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            if (isAddingIngredient) {
                commitNewIngredient();
            }
        }, 150);
    }

    return (
        <div className="flex flex-col h-screen bg-brown text-brown-dark border-brown-dark/50 antialiased overflow-hidden">
            <div className="w-full h-16 flex gap-4 items-center pl-4 border-b shrink-0">
                <div className="pt-1">
                    <Home size="24px" strokeWidth={1}/>
                </div>
                <h1 className="font-light">Household</h1>
                <Settings className="ml-auto mr-4" size="24px" strokeWidth={1} />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-72 flex flex-col ml-2 my-2 border rounded-md">
                    <div className="flex items-center justify-between p-2 pb-2 border-b border-brown-dark shrink-0">
                        <h2 className="font-medium">Zutatenliste</h2>
                        <button
                            onClick={handleShowInput}
                            className="w-6 h-6 flex items-center justify-center bg-green hover:bg-brown-dark border border-brown-dark/50 text-xl font-semibold text-brown rounded-sm transition-colors duration-200 focus:outline-none"
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
                                className="w-full px-2 py-2 mt-2 text-sm focus:ring-0 focus:outline-none transition-colors duration-200 border-b border-brown-dark"
                            />
                        </div>
                    )}

                    <ul className="flex-grow space-y-2 overflow-y-auto p-2">
                        {ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className="group flex items-center justify-between px-2 py-2 text-sm border border-brown-dark rounded-sm hover:shadow-sm shadow-brown-dark/25 transition-all duration-200"
                            >
                                <p>{ingredient}</p>
                                <div className="flex items-center">
                                    <button className="text-brown-dark hover:text-red-700 group-hover:opacity-100 group-hover:-translate-x-1 translate-x-4 opacity-0 transition-all duration-200">
                                        <Trash2 size="16px" />
                                    </button>
                                    <button className="text-brown-dark hover:text-green-dark group-hover:opacity-100 opacity-0 transition-all duration-200">
                                        <Edit size="16px" />
                                    </button>
                                </div>
                            </li>
                        ))}
                        {ingredients.length === 0 && !isAddingIngredient && (
                            <p className="mt-4 text-sm text-center text-gray-500">'+' um neue Zutat hinzuzufügen.</p>
                        )}
                    </ul>
                </aside>

                <main className="flex-1 p-6 overflow-y-auto"> 
                    <div className="max-w-3xl mx-auto space-y-6">
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <div key={recipe.id} className="p-4 border border-brown-dark rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <h3 className="pb-2 mb-3 text-2xl border-b border-brown-dark">
                                        {recipe.title}
                                    </h3>
                                    <div className="mb-3">
                                        <strong className="block mb-1 text-xs font-medium tracking-wide text-brown-dark uppercase">Key Ingredients:</strong>
                                        <p className="text-sm text-brown-dark">{recipe.ingredients.join(', ')}</p>
                                    </div>
                                    <div>
                                        <strong className="block mb-1 text-xs font-medium tracking-wide text-brown-dark uppercase">Method:</strong>
                                        <p className="text-sm leading-relaxed text-brown-dark">{recipe.instructions}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-10 text-center text-lg font-medium">Füge Zutaten deiner Liste hinzu, um Rezepte anzusehen.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App;
