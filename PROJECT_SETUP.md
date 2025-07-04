# Next.js 15 + shadcn/ui + Tailwind CSS Project

This project is a modern web application built with Next.js 15, shadcn/ui components, and Tailwind CSS. It provides a solid foundation for building beautiful, accessible, and performant web applications.

## 🚀 Features

- **Next.js 15** - Latest version with App Router, Server Components, and Turbopack support
- **shadcn/ui** - Beautiful, accessible components built with Radix UI and Tailwind CSS
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **TypeScript** - Full type safety and better developer experience
- **ESLint** - Code linting for consistent code quality

## 📦 What's Included

### Pre-installed shadcn/ui Components
- Button (with multiple variants)
- Card (with header, content, description)
- Input (form inputs)
- Label (form labels)

### Project Structure
```
nextjs-shadcn-project/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   └── lib/
│       └── utils.ts
├── components.json
├── tailwind.config.ts
└── package.json
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation & Development

1. **Navigate to the project directory:**
   ```bash
   cd nextjs-shadcn-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Adding More Components

To add more shadcn/ui components to your project:

```bash
# Add individual components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast

# Add multiple components at once
npx shadcn@latest add dialog dropdown-menu toast
```

### Popular Components to Consider
- `dialog` - Modal dialogs
- `dropdown-menu` - Dropdown menus
- `toast` - Toast notifications
- `tabs` - Tab navigation
- `accordion` - Collapsible content
- `avatar` - User avatars
- `badge` - Status badges
- `checkbox` - Checkboxes
- `select` - Select dropdowns
- `textarea` - Multi-line text inputs

## 🎯 Customization

### Theme Customization
The project uses a neutral color scheme by default. You can customize the theme by:

1. **Modifying CSS variables** in `src/app/globals.css`
2. **Updating the color palette** in `tailwind.config.ts`
3. **Using the shadcn/ui theme generator** at [ui.shadcn.com/themes](https://ui.shadcn.com/themes)

### Component Customization
All shadcn/ui components are fully customizable since they're copied into your project:
- Modify components in `src/components/ui/`
- Add your own variants and styles
- Extend functionality as needed

## 📱 Responsive Design

The demo page includes responsive design patterns:
- Mobile-first approach
- Responsive grid layouts
- Flexible button arrangements
- Adaptive spacing and typography

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Tutorial](https://nextjs.org/learn)

### shadcn/ui Resources
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)

### Tailwind CSS Resources
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/)

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding new component examples
- Improving the demo page
- Adding more documentation
- Reporting issues or bugs

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
