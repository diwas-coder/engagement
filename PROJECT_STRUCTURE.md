# Rakesh & Shivani Engagement Invitation — Project Structure

This is the exported Google AI Studio React/Vite project, organized without changing the existing invitation behavior.

```text
rakesh-shivani-engagement-invitation/
├── public/
│   ├── images/                 # Add local invitation photos here
│   │   ├── .gitkeep
│   │   └── README.md
│   └── music/                  # Optional music assets/instructions
│       ├── .gitkeep
│       └── README.md
├── src/
│   ├── components/
│   │   └── ScratchCard.tsx     # Heart-shaped scratch/reveal component
│   ├── App.tsx                 # Main invitation page and interactions
│   ├── main.tsx                # React entry point
│   └── index.css               # Theme, fonts and animations
├── assets/
│   └── .aistudio/
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Add an image

1. Put the image in `public/images/`.
2. Example: `public/images/couple.jpg`.
3. Reference it in React as `/images/couple.jpg`.

## Existing invitation features found in the source

- Opening/cover screen
- Background falling petals
- Heart-shaped scratch-to-reveal card
- Rakesh Sahani & Shivani Sahani name reveal
- Falling celebration flowers after reveal
- Countdown/event information
- Music toggle
- Google Maps venue button
- WhatsApp RSVP
- Responsive Tailwind styling

## Important

The current source uses a remote couple/venue image URL in `App.tsx`. The new `public/images/` folder is prepared for replacing those remote image references with your own local files when desired.
