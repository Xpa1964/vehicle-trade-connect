/**
 * ESLint Rule: no-unregistered-images
 * 
 * PLATFORM ENFORCEMENT: Blocks direct image paths in components.
 * All product images MUST go through the Static Image Registry.
 * 
 * This is an ERROR, not a warning.
 * 
 * @example
 * // ❌ BLOCKED
 * <img src="/images/hero.png" />
 * <img src="/assets/logo.png" />
 * <img src="/lovable-uploads/abc123.png" />
 * style={{ backgroundImage: 'url(/images/bg.png)' }}
 * 
 * // ✅ ALLOWED
 * <SafeImage imageId="home.hero" />
 * <RegistryImage imageId="services.showroom" />
 * const { src } = useStaticImage('home.hero');
 * <img src={src} /> // Dynamic from registry
 * 
 * // ✅ EXCEPTION: User content paths are allowed
 * <img src={vehicle.imageUrl} /> // Dynamic user content
 */

const FORBIDDEN_PATTERNS = [
  /^["'`]\/images\//,
  /^["'`]\/assets\//,
  /^["'`]\/lovable-uploads\//,
  /^["'`]src\/assets\//,
  /^["'`]\.\.?\/images\//,
  /^["'`]\.\.?\/assets\//,
];

const FORBIDDEN_PATTERN_STRINGS = [
  '/images/',
  '/assets/',
  '/lovable-uploads/',
  'src/assets/',
];

// Files where user-generated content is expected (exceptions)
const EXCEPTION_FILE_PATTERNS = [
  /vehicle/i,
  /auction/i,
  /upload/i,
  /avatar/i,
  /attachment/i,
  /user-content/i,
  /gallery.*image/i,
  /image.*gallery/i,
  // Registry and infrastructure files
  /staticImageRegistry/i,
  /imageAssets/i,
  /registryIntegrityCheck/i,
  /SafeImage/i,
  /RegistryImage/i,
  /SimpleImage/i,
  /useStaticImage/i,
  /imagePreloader/i,
];

// Allowed dynamic patterns (variables, not literals)
const isLiteralPath = (value) => {
  if (typeof value !== 'string') return false;
  return FORBIDDEN_PATTERN_STRINGS.some(pattern => value.includes(pattern));
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce Static Image Registry usage for all product images',
      category: 'Platform Enforcement',
      recommended: true,
    },
    messages: {
      noDirectImagePath: 
        '🚫 Direct image path detected: "{{path}}". Use SafeImage with imageId or useStaticImage() hook instead. See /docs/STATIC_IMAGE_PLATFORM.md',
      noDirectBackgroundUrl:
        '🚫 Direct background-image URL detected. Use registry-resolved paths. See /docs/STATIC_IMAGE_PLATFORM.md',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    
    // Check if file is an exception
    const isException = EXCEPTION_FILE_PATTERNS.some(pattern => pattern.test(filename));
    if (isException) {
      return {};
    }

    return {
      // Check JSX img elements with literal src
      JSXOpeningElement(node) {
        if (node.name.name !== 'img') return;

        const srcAttr = node.attributes.find(
          attr => attr.type === 'JSXAttribute' && attr.name.name === 'src'
        );

        if (!srcAttr || !srcAttr.value) return;

        // Check literal string values
        if (srcAttr.value.type === 'Literal' && typeof srcAttr.value.value === 'string') {
          const path = srcAttr.value.value;
          if (isLiteralPath(path)) {
            context.report({
              node: srcAttr,
              messageId: 'noDirectImagePath',
              data: { path },
            });
          }
        }

        // Check template literals
        if (srcAttr.value.type === 'JSXExpressionContainer') {
          const expr = srcAttr.value.expression;
          if (expr.type === 'TemplateLiteral') {
            const fullValue = expr.quasis.map(q => q.value.raw).join('');
            if (isLiteralPath(fullValue)) {
              context.report({
                node: srcAttr,
                messageId: 'noDirectImagePath',
                data: { path: fullValue },
              });
            }
          }
          if (expr.type === 'Literal' && typeof expr.value === 'string') {
            if (isLiteralPath(expr.value)) {
              context.report({
                node: srcAttr,
                messageId: 'noDirectImagePath',
                data: { path: expr.value },
              });
            }
          }
        }
      },

      // Check style props with backgroundImage
      Property(node) {
        if (node.key.name !== 'backgroundImage' && node.key.value !== 'backgroundImage') {
          return;
        }

        if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const value = node.value.value;
          if (value.includes('url(') && isLiteralPath(value)) {
            context.report({
              node,
              messageId: 'noDirectBackgroundUrl',
            });
          }
        }

        if (node.value.type === 'TemplateLiteral') {
          const fullValue = node.value.quasis.map(q => q.value.raw).join('');
          if (fullValue.includes('url(') && isLiteralPath(fullValue)) {
            context.report({
              node,
              messageId: 'noDirectBackgroundUrl',
            });
          }
        }
      },
    };
  },
};
