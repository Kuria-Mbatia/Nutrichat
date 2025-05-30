
Project Name: NutriChat Local (for Reboot the Earth 2025 NYC)

Challenge Focus: AI for Equitable and Personalized Nutrition in Diverse U.S. Communities. Specifically aligns with sub-themes like "Personalized Nutrition Guidance" and "Local Nutrition Education."

It should accomplish teh following:

1. Develop an AI tool that provides tailored, budget-conscious meal planning and grocery tips for users of public assistance programs, integrating personal and cultural preferences. 

2. Develop an accessible chatbot to answer nutritional questions, tailored to local cultural diets and availability. 

3. Develop a platform for city officials that translates national dietary guidelines into localized, community specific interventions. 


Core Goals (Aligned with Hackathon "How to Win" Criteria):

Innovative & Ethical AI for Societal Challenges: Develop an AI tool to provide personalized, budget-conscious, and culturally relevant nutrition guidance, addressing previously intractable issues of equitable access to healthy food information.
Open Source & Digital Public Good for SDGs: Create a solution that can be shared openly, works towards Sustainable Development Goals (SDG 2 - Zero Hunger, SDG 3 - Good Health & Well-being, SDG 10 - Reduced Inequalities), and embodies digital principles.
Scalable with Real-World Impact: Design a solution with a clear path for adoption, empowering diverse U.S. communities with accessible nutrition education and resource navigation.
Detailed Scope for MVP (24-Hour Hackathon Focus - May 29-30):

User Interaction & Context Gathering (Chat-First):

In-Scope:
Initiate chat by asking the user for their approximate location (e.g., zip code or neighborhood within a pre-defined NYC demo area).
Ask for one primary dietary goal, cultural preference, or need (e.g., "budget-friendly meals for a family," "plant-based options respecting [cultural] diet," "find SNAP-accepting fresh food vendors").
Store this limited context in session state (stateless across sessions).
Out-of-Scope for MVP: Complex multi-turn preference elicitation, detailed allergy tracking, remembering users across sessions.
Local Resource Discovery & Mapping (NYC Demo Area):

In-Scope:
Utilize a pre-curated GeoJSON file containing 5-10 sample food resources for the NYC demo area (e.g., SNAP-accepting farmers' markets, community kitchens, culturally specific grocery stores, food pantries).
Filter these resources based on the user's provided NYC location.
Display the filtered resources as points on an embedded Mapbox GL JS map.
Out-of-Scope for MVP: Live integration of multiple external APIs for resource discovery across diverse U.S. communities (beyond demo data), advanced map filtering.
AI-Powered Personalized & Equitable Advice:

In-Scope:
Use an LLM (via a secure Next.js API route) to generate:
Tailored, budget-conscious meal planning tips or simple recipe ideas that consider the user's stated cultural preferences and locally available (curated) resources.
Answers to nutritional questions, tailored to local cultural diets and food availability (based on curated data and LLM knowledge).
Information on accessing/utilizing identified local food resources equitably.
Out-of-Scope for MVP: Detailed grocery lists, comprehensive nutritional analysis from a database, direct integration with public assistance program eligibility checkers.
Technology Implementation (Open Source Focused):

In-Scope:
Frontend: TypeScript with React (Next.js), potentially using a v0.dev template as a UI starter.
Backend: TypeScript with Next.js API Routes for LLM calls and data handling.
Map: Basic Mapbox GL JS embed.
Security: LLM API keys managed via Vercel environment variables, accessed only by backend API routes.
All original code developed will be open source.
Out-of-Scope for MVP: Elaborate custom styling beyond the v0 template, extensive error handling for all edge cases.
Core User Summary (for Hackathon Demo): 🧑‍🤝‍🧑

An individual in the specified NYC demo area (representing diverse U.S. communities) seeking:
Personalized and culturally relevant nutritional guidance that is budget-conscious, especially if navigating public assistance programs.
Accessible information on local food resources (e.g., markets, food banks, community kitchens) that align with their needs and preferences.
Simplified Core Feature Set (MVP for Submission on May 30th, 2:00 PM): ✨

Targeted Context Input (Chat):
Chat prompts user for their NYC general location (text input) and one key dietary/cultural/budget need (e.g., "halal options on a budget," "fresh vegetables near me that accept SNAP").
NYC Resource Display (Map & Chat):
Chat lists 1-3 relevant local food resources (from a pre-curated NYC GeoJSON list) based on location and need.
Map visually shows these listed resource points within the NYC demo area.
AI-Powered Equitable Tip (Chat):
The LLM provides one concise, actionable tip or piece of guidance tailored to the user's need, cultural context, and the type of local NYC resource(s) identified (e.g., "The [Market Name] near you accepts SNAP for fresh produce. Consider [simple culturally relevant meal tip using seasonal vegetables found there].").
This streamlined scope ensures a relevant and impactful submission for the "AI for Equitable and Personalized Nutrition" challenge, focusing on delivering a demonstrable solution within the hackathon timeframe.

Ensure that the memory bank is in the main folder not the basic_Chat_Site_V0 folder please!