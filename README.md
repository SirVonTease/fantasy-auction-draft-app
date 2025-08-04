# Fantasy NFL Draft Assistant

A real-time fantasy football draft assistant built with React and TypeScript, designed to work perfectly on iPad and other mobile devices.

## Features

### 🏈 Draft Board
- Real-time draft tracking with current pick and round display
- Available players list with rankings, ADP, and projected points
- One-tap player drafting
- Recent picks history
- Pause/resume draft functionality

### 🔍 Player Search
- Search players by name, team, or position
- Filter by position (QB, RB, WR, TE, K, DEF)
- Sort by rank, ADP, or projected points
- Real-time search results

### 👥 Team Rosters
- View all teams and their drafted players
- Position breakdown for each team
- Projected points totals
- Auction budget tracking (if applicable)
- Detailed player information

### ⚙️ Settings
- Configure league size (8-16 teams)
- Set roster size (12-20 players)
- Choose between snake draft and auction draft
- Customize position requirements
- Manage team names and owners
- Set auction budgets

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fantasy-nfl-draft-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To build the app for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### For iPad/Mobile
1. Open the app in Safari or Chrome
2. Add to home screen for a native app experience
3. The app is optimized for touch interactions and portrait orientation

### Draft Process
1. **Setup**: Go to Settings to configure your league
2. **Search**: Use the Search tab to find specific players
3. **Draft**: Use the Draft Board to make picks
4. **Track**: Monitor team rosters and league progress

### Real-time Updates
- The app updates in real-time as picks are made
- All team rosters are automatically updated
- Draft order and current pick are tracked automatically

## Technical Details

### Built With
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### Architecture
- **Context API** - State management
- **Component-based** - Modular design
- **Responsive** - Mobile-first approach
- **Touch-optimized** - iPad-friendly interactions

### Data Structure
The app uses a comprehensive data model for:
- **Players**: Name, position, team, rankings, projections
- **Teams**: Name, owner, players, budget
- **Draft State**: Current pick, round, settings
- **Settings**: League configuration, position requirements

## Customization

### Adding More Players
Edit the `loadSampleData` function in `DraftBoard.tsx` to add more players to the sample data.

### Styling
The app uses Tailwind CSS with custom colors:
- NFL Blue: `#013369`
- NFL Red: `#D50A0A`
- Draft Green: `#10B981`
- Draft Yellow: `#F59E0B`
- Draft Red: `#EF4444`

### Position Colors
Each position has its own color scheme:
- QB: Blue
- RB: Green
- WR: Purple
- TE: Orange
- K: Gray
- DEF: Red

## Future Enhancements

- [ ] Real-time collaboration with WebSocket
- [ ] Import player data from external APIs
- [ ] Draft strategy recommendations
- [ ] Trade functionality
- [ ] Draft history export
- [ ] Custom scoring systems
- [ ] Mock draft mode
- [ ] Player news and updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Good luck with your fantasy draft! 🏆**