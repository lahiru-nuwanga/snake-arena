# Snake Game

A classic Snake mini game for PC, playable in any modern web browser. Built with HTML, CSS, and vanilla JavaScript—no frameworks.

---

## Game Architecture and Logic

### Overview

The game uses a **grid-based model**: the board is a 20×20 grid of cells. The snake and food are represented by cell coordinates `(x, y)`. Movement happens in discrete **ticks** at a fixed interval (e.g. 120 ms), so the snake moves one cell per tick.

### Core Components

| Component | Role |
|----------|------|
| **HTML** | Structure: canvas, score, Game Over / Start overlays, buttons. |
| **CSS** | Layout, colors, responsive sizing, overlay visibility. |
| **JavaScript** | State (snake, food, direction, score), game loop, input, drawing. |

### Game State

- **`snake`** – Array of `{ x, y }` cells. Index `0` is the head; new head is added at front, tail is removed each tick (unless the snake eats food).
- **`food`** – Single `{ x, y }` cell. Regenerated at a random empty cell after being eaten.
- **`direction`** / **`nextDirection`** – Current and queued movement. Only one direction change is applied per tick; **opposite direction is blocked** so you can’t reverse into yourself in one frame.
- **`score`** – Increases by 10 per food eaten.
- **`gameOver`** – Stops the loop and shows the Game Over overlay.

### Game Loop

1. **Tick** (every `INITIAL_SPEED_MS` ms):
   - Apply `nextDirection` to `direction` (if not opposite).
   - Compute new head = current head + direction.
   - **Collisions**: wall (out of 0..19) or self (new head on any segment) → game over.
   - Add new head to front of snake.
   - If new head equals food: add score, place new food, **don’t** remove tail (snake grows).
   - Else: remove tail (snake moves without growing).
   - Redraw canvas (background, grid, food, snake body, snake head).

2. **Input**: On keydown (Arrow keys or WASD), set `nextDirection` only if it’s not opposite to current `direction`, and prevent default for those keys.

3. **Restart**: Clear interval, reset state (snake, food, score, direction), hide Game Over overlay, start loop again.

### Why No Opposite Direction?

If the snake is moving right and the user presses left in the same tick, the head would move left into the previous “neck” cell and trigger a self-collision. Blocking opposite direction changes removes this instant-death bug and matches expected behavior.

---

## How to Run Locally

1. **Clone or download** this project to a folder on your PC.

2. **Option A – Simple HTTP server (recommended)**  
   From the project folder in a terminal:

   ```bash
   # Python 3
   python -m http.server 8080

   # or Node (if you have npx)
   npx serve .
   ```

   Then open: **http://localhost:8080** (or the port shown).

3. **Option B – Open file directly**  
   Double-click `index.html` or drag it into the browser. Some browsers may restrict local file access; if the game doesn’t load, use Option A.

4. Click **Start Game**, then use **Arrow keys** or **WASD** to move. Eat the red food to grow and increase your score; avoid walls and your own tail.

---

## How to Deploy Online (Worldwide Access)

The project is static (HTML + CSS + JS), so it works on any static host.

### GitHub Pages

1. Create a new repository on GitHub and push this project (or upload the files).
2. Go to **Settings → Pages**.
3. Under **Source**, choose **main** (or your default branch) and **/ (root)**.
4. Save. Your game will be at: `https://<username>.github.io/<repo-name>/`.

### Netlify

1. Sign up at [netlify.com](https://www.netlify.com).
2. **Add new site → Import an existing project** (e.g. connect GitHub and select the repo).
3. Build command: leave empty. Publish directory: **`.`** (root).
4. Deploy. Netlify gives you a URL like `https://your-site.netlify.app`.

### Vercel

1. Sign up at [vercel.com](https://vercel.com).
2. **Add New Project** and import your Git repo (or upload the folder).
3. Leave framework preset as default; root directory = project folder.
4. Deploy. You get a URL like `https://your-project.vercel.app`.

After deployment, share the URL so anyone can play the game in their browser.

---

## Optional Advanced Features

Ideas to extend the game without changing the core architecture:

| Feature | Description |
|--------|-------------|
| **Leaderboard** | Store top scores in `localStorage`, or use a backend/DB and show a “Top 10” list. |
| **Levels** | Increase speed (e.g. decrease `INITIAL_SPEED_MS`) or add obstacles after every N points. |
| **Sound** | Play short audio on eat (food), game over, and optionally background music using the Web Audio API or `<audio>` elements. |
| **Themes** | Add a theme toggle (e.g. light/dark) via CSS variables and a small JS handler. |
| **Touch controls** | On mobile, show on-screen arrows or swipe and map them to direction changes. |
| **High score** | Persist best score in `localStorage` and display “Best: X” next to the current score. |

---

## File Summary

| File | Purpose |
|------|--------|
| `index.html` | Page structure, canvas, score, overlays, buttons. |
| `style.css` | Layout, colors, overlays, responsive rules. |
| `game.js` | Config, state, init, game loop, input, drawing, restart. |

No build step or external dependencies are required; the game runs as-is in a modern browser.
