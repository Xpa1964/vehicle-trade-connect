
# Contributing to KONTACT VO | Contribuir a KONTACT VO

We love your input! We want to make contributing to KONTACT VO as easy and transparent as possible.

¡Nos encanta tu participación! Queremos hacer que contribuir a KONTACT VO sea lo más fácil y transparente posible.

## Development Process | Proceso de Desarrollo

We use GitHub to sync code to and from our internal repository. We'll use GitHub to track issues and feature requests, as well as accept pull requests.

Usamos GitHub para sincronizar código hacia y desde nuestro repositorio interno. Usaremos GitHub para rastrear issues y solicitudes de características, así como aceptar pull requests.

## Pull Requests | Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

Damos la bienvenida activa a tus pull requests:

1. Haz fork del repo y crea tu rama desde `main`.
2. Si has añadido código que debería ser probado, añade pruebas.
3. Si has cambiado APIs, actualiza la documentación.
4. Asegúrate de que la suite de pruebas pase.
5. Asegúrate de que tu código pase el linting.
6. ¡Envía ese pull request!

## Code Style | Estilo de Código

### TypeScript & React

* Use TypeScript for all new code
* Follow React functional component patterns
* Use custom hooks for reusable logic
* Prefer composition over inheritance

### Styling

* Use Tailwind CSS classes
* Follow the existing design system
* Use shadcn/ui components when possible
* Maintain responsive design principles

### File Organization

* Keep components small and focused
* Use proper folder structure: `components/`, `pages/`, `hooks/`, etc.
* Name files using PascalCase for components, camelCase for utilities
* Export components as default, utilities as named exports

## Commit Convention | Convención de Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new vehicle auction feature
fix: resolve mobile navigation issue
docs: update installation instructions
style: improve dashboard layout spacing
refactor: optimize message loading performance
test: add unit tests for authentication
chore: update dependencies
```

## Issues | Issues

We use GitHub issues to track public bugs and feature requests. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

Usamos los issues de GitHub para rastrear bugs públicos y solicitudes de características. Asegúrate de que tu descripción sea clara y tenga suficientes instrucciones para poder reproducir el issue.

### Bug Reports | Reportes de Bugs

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce (be specific!)
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Feature Requests | Solicitudes de Características

We welcome feature requests! Please include:

- Clear description of the feature
- Use cases and benefits
- Any mockups or examples if applicable
- Consider backward compatibility

## Development Setup | Configuración de Desarrollo

### Prerequisites | Prerrequisitos

- Node.js 18+
- npm or yarn
- Git
- Supabase account (for backend features)

### Local Development | Desarrollo Local

```bash
# Clone your fork | Clona tu fork
git clone https://github.com/yourusername/kontact-vo.git
cd kontact-vo

# Install dependencies | Instala dependencias
npm install

# Copy environment variables | Copia variables de entorno
cp .env.example .env

# Start development server | Inicia servidor de desarrollo
npm run dev
```

### Environment Variables | Variables de Entorno

See `.env.example` for required environment variables. You'll need:

- Supabase credentials
- Any API keys for external services

## Testing | Pruebas

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers and devices
- Verify responsive design works correctly

## Translation | Traducción

KONTACT VO supports multiple languages. When adding new text:

1. Add the key to the appropriate translation files in `src/translations/`
2. Use the `useLanguage` hook to access translations
3. Test with different languages enabled
4. Ensure RTL languages display correctly if applicable

## Security | Seguridad

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Follow security best practices for authentication
- Report security vulnerabilities via our [Security Policy](SECURITY.md)

## Code of Conduct | Código de Conducta

### Our Pledge | Nuestro Compromiso

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

Estamos comprometidos a hacer que la participación en nuestro proyecto sea una experiencia libre de acoso para todos, independientemente de la edad, tamaño corporal, discapacidad, etnia, identidad y expresión de género, nivel de experiencia, nacionalidad, apariencia personal, raza, religión o identidad y orientación sexual.

### Our Standards | Nuestros Estándares

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

## Recognition | Reconocimiento

Contributors will be recognized in:

- GitHub contributors list
- Project documentation
- Release notes for significant contributions

## Questions? | ¿Preguntas?

Don't hesitate to ask questions! You can:

- Open an issue for discussion
- Join our community discussions
- Reach out to maintainers directly

Thank you for contributing to KONTACT VO! 🚗✨

¡Gracias por contribuir a KONTACT VO! 🚗✨
