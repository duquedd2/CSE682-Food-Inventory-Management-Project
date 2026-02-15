-- Seed data for Food Inventory Management System

-- Sample Recipes
INSERT INTO recipes (title, description, prep_time_minutes, cook_time_minutes, servings, difficulty, ingredients, instructions) VALUES
(
  'Scrambled Eggs',
  'Classic fluffy scrambled eggs - perfect for a quick breakfast.',
  5, 5, 2, 'easy',
  '[{"name":"eggs","quantity":"4","unit":"pcs"},{"name":"butter","quantity":"1","unit":"tbsp"},{"name":"milk","quantity":"2","unit":"tbsp"},{"name":"salt","quantity":"1","unit":"pinch"}]',
  '1. Crack eggs into a bowl and whisk with milk and salt.\n2. Melt butter in a non-stick pan over medium-low heat.\n3. Pour in egg mixture and gently stir with a spatula.\n4. Cook until just set but still creamy.\n5. Serve immediately.'
),
(
  'Pasta Marinara',
  'Simple Italian pasta with a rich tomato marinara sauce.',
  10, 20, 4, 'easy',
  '[{"name":"pasta","quantity":"1","unit":"lbs"},{"name":"tomato sauce","quantity":"2","unit":"cups"},{"name":"garlic","quantity":"3","unit":"cloves"},{"name":"olive oil","quantity":"2","unit":"tbsp"},{"name":"basil","quantity":"1","unit":"tsp"}]',
  '1. Boil a large pot of salted water and cook pasta according to package directions.\n2. Heat olive oil in a saucepan, add minced garlic and cook 1 minute.\n3. Add tomato sauce and basil, simmer for 15 minutes.\n4. Drain pasta and toss with sauce.\n5. Serve with parmesan if desired.'
),
(
  'Chicken Stir Fry',
  'Quick and healthy chicken stir fry with vegetables and rice.',
  15, 15, 4, 'medium',
  '[{"name":"chicken breast","quantity":"1","unit":"lbs"},{"name":"rice","quantity":"2","unit":"cups"},{"name":"bell pepper","quantity":"1","unit":"pcs"},{"name":"broccoli","quantity":"1","unit":"cups"},{"name":"soy sauce","quantity":"3","unit":"tbsp"},{"name":"garlic","quantity":"2","unit":"cloves"},{"name":"vegetable oil","quantity":"2","unit":"tbsp"}]',
  '1. Cook rice according to package directions.\n2. Cut chicken into bite-sized pieces and season with salt.\n3. Heat oil in a wok over high heat, cook chicken until golden (5-6 min).\n4. Add chopped vegetables and garlic, stir fry 3-4 minutes.\n5. Add soy sauce and toss everything together.\n6. Serve over rice.'
),
(
  'Grilled Cheese Sandwich',
  'Golden crispy grilled cheese - the ultimate comfort food.',
  5, 8, 1, 'easy',
  '[{"name":"bread","quantity":"2","unit":"slices"},{"name":"cheese","quantity":"2","unit":"slices"},{"name":"butter","quantity":"1","unit":"tbsp"}]',
  '1. Butter one side of each bread slice.\n2. Place one slice butter-side down in a skillet over medium heat.\n3. Add cheese slices on top.\n4. Place second bread slice butter-side up on top.\n5. Cook until golden brown, flip, and cook other side.\n6. Slice and serve.'
),
(
  'Caesar Salad',
  'Crisp romaine lettuce with creamy Caesar dressing and croutons.',
  10, 0, 2, 'easy',
  '[{"name":"romaine lettuce","quantity":"1","unit":"head"},{"name":"croutons","quantity":"1","unit":"cups"},{"name":"parmesan","quantity":"0.25","unit":"cups"},{"name":"caesar dressing","quantity":"3","unit":"tbsp"}]',
  '1. Wash and chop romaine lettuce into bite-sized pieces.\n2. Place in a large bowl.\n3. Add croutons and shaved parmesan.\n4. Drizzle with Caesar dressing and toss to coat.\n5. Serve immediately.'
),
(
  'Beef Tacos',
  'Seasoned ground beef tacos with fresh toppings.',
  15, 15, 4, 'easy',
  '[{"name":"ground beef","quantity":"1","unit":"lbs"},{"name":"taco shells","quantity":"8","unit":"pcs"},{"name":"lettuce","quantity":"1","unit":"cups"},{"name":"tomato","quantity":"1","unit":"pcs"},{"name":"cheese","quantity":"0.5","unit":"cups"},{"name":"taco seasoning","quantity":"1","unit":"packet"}]',
  '1. Brown ground beef in a skillet over medium-high heat.\n2. Drain excess fat and add taco seasoning with water per package directions.\n3. Simmer 5 minutes until thickened.\n4. Warm taco shells in the oven.\n5. Fill shells with beef, then top with lettuce, diced tomato, and cheese.\n6. Serve with salsa and sour cream.'
),
(
  'Banana Smoothie',
  'Creamy banana smoothie - great for a quick healthy snack.',
  5, 0, 1, 'easy',
  '[{"name":"banana","quantity":"1","unit":"pcs"},{"name":"milk","quantity":"1","unit":"cups"},{"name":"yogurt","quantity":"0.5","unit":"cups"},{"name":"honey","quantity":"1","unit":"tbsp"}]',
  '1. Peel and slice the banana.\n2. Add banana, milk, yogurt, and honey to a blender.\n3. Blend on high until smooth and creamy.\n4. Pour into a glass and serve immediately.'
),
(
  'Spaghetti Bolognese',
  'Hearty Italian meat sauce over spaghetti - a family favorite.',
  20, 40, 6, 'medium',
  '[{"name":"spaghetti","quantity":"1","unit":"lbs"},{"name":"ground beef","quantity":"1","unit":"lbs"},{"name":"tomato sauce","quantity":"2","unit":"cups"},{"name":"onion","quantity":"1","unit":"pcs"},{"name":"garlic","quantity":"3","unit":"cloves"},{"name":"olive oil","quantity":"2","unit":"tbsp"},{"name":"oregano","quantity":"1","unit":"tsp"}]',
  '1. Heat olive oil in a large pot, add diced onion and cook until soft.\n2. Add minced garlic and cook 1 minute.\n3. Add ground beef and cook until browned, breaking it apart.\n4. Add tomato sauce and oregano, stir to combine.\n5. Simmer on low for 30 minutes, stirring occasionally.\n6. Cook spaghetti according to package directions.\n7. Serve sauce over spaghetti.'
),
(
  'Rice and Beans',
  'Budget-friendly and nutritious rice and beans bowl.',
  10, 30, 4, 'easy',
  '[{"name":"rice","quantity":"2","unit":"cups"},{"name":"black beans","quantity":"1","unit":"cans"},{"name":"onion","quantity":"1","unit":"pcs"},{"name":"garlic","quantity":"2","unit":"cloves"},{"name":"cumin","quantity":"1","unit":"tsp"},{"name":"olive oil","quantity":"1","unit":"tbsp"}]',
  '1. Cook rice according to package directions.\n2. Heat olive oil in a saucepan, add diced onion and cook until soft.\n3. Add minced garlic and cumin, cook 1 minute.\n4. Add drained and rinsed black beans, cook 10 minutes.\n5. Season with salt and pepper to taste.\n6. Serve beans over rice.'
),
(
  'Chicken Alfredo',
  'Creamy fettuccine alfredo with grilled chicken.',
  15, 25, 4, 'medium',
  '[{"name":"fettuccine","quantity":"1","unit":"lbs"},{"name":"chicken breast","quantity":"1","unit":"lbs"},{"name":"heavy cream","quantity":"1","unit":"cups"},{"name":"parmesan","quantity":"0.5","unit":"cups"},{"name":"butter","quantity":"2","unit":"tbsp"},{"name":"garlic","quantity":"2","unit":"cloves"}]',
  '1. Season chicken breasts with salt and pepper.\n2. Cook chicken in a skillet over medium heat until done (6-7 min per side). Slice.\n3. Cook fettuccine according to package directions.\n4. In the same skillet, melt butter and add garlic for 1 minute.\n5. Add heavy cream and bring to a simmer.\n6. Stir in parmesan until melted and smooth.\n7. Toss pasta in the sauce, top with sliced chicken.'
);

-- Sample Grocery Stores (Syracuse, NY area)
INSERT INTO grocery_stores (name, address, city, state, zip_code, latitude, longitude) VALUES
('Walmart Supercenter', '3825 Route 31', 'Liverpool', 'NY', '13090', 43.1066, -76.2178),
('Wegmans', '6789 E Genesee St', 'Fayetteville', 'NY', '13066', 43.0317, -76.0044),
('Trader Joes', '3409 Erie Blvd E', 'DeWitt', 'NY', '13214', 43.0458, -76.0782),
('Tops Friendly Markets', '2100 S Salina St', 'Syracuse', 'NY', '13205', 43.0236, -76.1487),
('Aldi', '3450 Erie Blvd E', 'DeWitt', 'NY', '13214', 43.0460, -76.0775),
('Price Chopper', '4256 E Genesee St', 'Syracuse', 'NY', '13214', 43.0399, -76.0893),
('Costco Wholesale', '150 Township Blvd', 'Camillus', 'NY', '13031', 43.0352, -76.2619),
('Target', '3476 Erie Blvd E', 'DeWitt', 'NY', '13214', 43.0461, -76.0770);

-- Sample Restaurants (Syracuse, NY area)
INSERT INTO restaurants (name, cuisine_type, address, estimated_delivery_minutes) VALUES
('Dinosaur Bar-B-Que', 'BBQ', '246 W Willow St, Syracuse, NY', 35),
('Pastabilities', 'Italian', '311 S Franklin St, Syracuse, NY', 30),
('Chipotle Mexican Grill', 'Mexican', '215 W Jefferson St, Syracuse, NY', 25),
('Sakana-Ya Sushi', 'Japanese', '215 E Water St, Syracuse, NY', 40),
('Alto Cinco', 'Latin American', '526 Westcott St, Syracuse, NY', 35),
('Panda West', 'Chinese', '471 Westcott St, Syracuse, NY', 30),
('Varsity Pizza', 'Pizza', '802 S Crouse Ave, Syracuse, NY', 20),
('Starbucks', 'Cafe', '113 Marshall St, Syracuse, NY', 15);
