# PetWise

## FBLA Competitive Event
Introduction to Programming

## Competitors
Grace Sun
Yueling Sun
Grace Zhu


## Project Overview
PetWise is an interactive virtual pet simulation designed to teach teens financial literacy, budgeting, and personal responsibility through the experience of pet ownership.
Many young people struggle with managing money and understanding the long-term responsibilities involved in caring for a pet. PetWise addresses this issue by combining a virtual pet system with a structured in-game economy. Rather than simply explaining these concepts, the program allows users to actively experience decision-making, budgeting, and accountability through gameplay.


## Purpose
The goal of PetWise is to:
* Promote financial literacy among teens
* Demonstrate the real responsibilities of pet ownership
* Encourage strategic decision-making
* Show consequences tied to resource management
By simulating real-life responsibilities, users learn that caring for a pet requires both time and financial planning.

## Key Features

### Pet Adoption System
* Users begin with an onboarding screen (`Onboarding.tsx`)
* Players choose between a dog, cat, or rabbit
* Users name their pet before starting the simulation

### Customizable Interface
* Theme customization using a color palette selector
* Multiple background themes improve accessibility and engagement
* Retro-style music enhances immersion

### Activity System
Five main activity categories:
* Food
* Play
* Health
* Sleep
* Chores

Activities are displayed using a reusable component (`ActivityCard.tsx`) that dynamically updates based on the selected theme and activity data.

Each action affects:
* Pet vitals
* Coin balance
* Overall pet wellbeing

### Budgeting & Currency System

* Users start with **100 coins**
* Many activities require spending coins
* Players must prioritize needs and manage limited resources

This system reinforces real-world budgeting concepts.

### Chore Minigames

Users can earn coins through performance-based minigames:
* Flappy Bird
* Ping Pong
* Memory Match

Each minigame is implemented in its own TSX file and contains independent physics, graphics, and scoring logic.

Coins earned are proportional to performance, reinforcing the idea that income must be earned to support expenses.

### Pet Vitals System
Four dynamic status bars:
* Saturation
* Happiness
* Energy
* Health

Each stat:
* Starts at 100%
* Decreases by 1% every 15 seconds
* Changes based on user actions

This mechanic simulates the ongoing responsibility required in real-life pet care.

### Milestones & Activity Log
* Milestones reward responsible care through unlockable badges
* A “Recent Care” log records completed actions and coin costs
* Users can review decisions and adjust spending strategies

This transforms gameplay into reflective learning.

### Consequence System

If any stat reaches zero:
* `pet.isDead` in `Dashboard.tsx` triggers a death state
* Users must restart from onboarding

This intentional reset reinforces accountability and demonstrates consequences of neglect.


## Technologies Used
* TypeScript
* React / TSX Components
* Tailwind CSS
* Replit (online IDE)
* GitHub (asset storage and management)

TypeScript’s static typing improved reliability by catching errors early during development.


## Program Structure
The application follows a modular component-based structure:

```
/components
   ActivityCard.tsx
   Onboarding.tsx
   Dashboard.tsx
/minigames
   FlappyBird.tsx
   PingPong.tsx
   MemoryMatch.tsx
/assets
   graphics
   music
```
Each file is responsible for a specific feature, improving maintainability and scalability.

## How to Run the Project

1. Open the Replit project link.
2. Click **Run**.
3. Complete the onboarding process.
4. Interact with activities to care for your pet.
5. Earn coins through chores and manage resources strategically.


## Development Process

PetWise was developed using Replit for coding, testing, and debugging.
Tailwind CSS enabled rapid interface design, while TypeScript improved organization and reduced runtime errors.

The project was built using modular components so features could be expanded easily in future versions.


## Challenges & Solutions

**Challenge:** Managing real-time stat decay and updates.
**Solution:** Implemented timed state updates using TypeScript logic within dashboard components.

**Challenge:** Keeping the program organized as features expanded.
**Solution:** Adopted a modular file structure separating onboarding, activities, and mini-games.

---

## Future Improvements

* User accounts and save data
* Additional pets and activities
* Expanded mini-games
* Mobile responsiveness
* Cloud-based data storage


## Educational Impact

PetWise mirrors real-life pet ownership by requiring consistent care, budgeting, and decision-making. Unlike simplified educational tools, the simulation demonstrates long-term responsibility and meaningful consequences.

By combining gamification with financial principles, PetWise helps teens become more responsible decision-makers and more informed future pet owners.


## Credits

Created for FBLA Introduction to Programming Competition.

Graphics and music assets organized through a shared GitHub repository.


## License
Educational use only. All rights reserved 2026.
