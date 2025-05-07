import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, FocusEvent } from "react";


interface Recipe {
    id: number;
    title: string;
    ingredients: string[]
    instructions: string;
}

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Basil', 'Olive Oil', 'Pasta']);
    const [newIngredient, setNewIngredient] = useState<string>('');
    const [isAddingIngredient, setIsAddingIngredient] = useState<boolean>(false)
    const ingredientInputRef = useRef<HTMLInputElement>(null);

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
    
    useEffect(() => {
        if (isAddingIngredient && ingredientInputRef.current) {
            ingredientInputRef.current.focus();
        }
    }, [isAddingIngredient])

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
        <div className="flex h-screen bg-gray-900 text-gray-200 antialiased">
            <div className="absolute top-0 left-0 bottom-0 z-10 flex h-full w-72 flex-col bg-gray-800 p-5 shadow-2xl border-r border-gray-700/60 rounded-r-xl">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-100">Ingredients</h2>
                    <button
                        onClick={handleShowInput}
                        className="flex items-center justify-center w-10 h-10 text-3xl font-light text-white transition-colors duration-150 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                        aria-label="Add new ingredient"
                    >
                        +
                    </button>
                </div>

                {isAddingIngredient && (
                <div className="mb-4">
                    <input
                    type="text"
                    ref={ingredientInputRef}
                    value={newIngredient}
                    onChange={handleNewIngredientChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    placeholder="Type & press Enter..."
                    className="w-full p-3 text-sm bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150"
                    />
                </div>
                )}

                <ul className="flex-grow pr-1 space-y-2.5 overflow-y-auto">
                {ingredients.map((ingredient, index) => (
                    <li
                    key={index}
                    className="px-3.5 py-2.5 text-sm bg-gray-700/70 rounded-md text-gray-300 shadow-sm hover:bg-gray-600/70 transition-colors duration-100"
                    >
                    {ingredient}
                    </li>
                ))}
                {ingredients.length === 0 && !isAddingIngredient && (
                    <p className="text-sm text-center text-gray-500">No ingredients added yet.</p>
                )}
                </ul>
            </div>

            <main className="flex-1 h-screen p-8 overflow-y-auto ml-72">
                <div className="max-w-3xl mx-auto space-y-8">
                {placeholderRecipes.length > 0 ? (
                    placeholderRecipes.map((recipe) => (
                    <div key={recipe.id} className="p-6 bg-gray-800 border border-gray-700/50 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h3 className="pb-3 mb-4 text-2xl font-semibold border-b text-indigo-400 border-gray-700">
                        {recipe.title}
                        </h3>
                        <div className="mb-4">
                        <strong className="block mb-1.5 text-sm font-medium text-gray-400">Key Ingredients:</strong>
                        <p className="text-sm text-gray-300">{recipe.ingredients.join(', ')}</p>
                        </div>
                        <div>
                        <strong className="block mb-1.5 text-sm font-medium text-gray-400">Method:</strong>
                        <p className="text-sm leading-relaxed text-gray-300">{recipe.instructions}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="py-10 text-center">
                    <p className="text-lg text-gray-500">No recipes available at the moment.</p>
                    </div>
                )}
                </div>
            </main>
        </div>
    )
}

export default App;
