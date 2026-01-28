
import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import BlogList from '@/components/blog/BlogList';

const BlogMainPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 min-h-[320px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/eec67196-c0f3-47cb-9620-773175533a94.png"
              alt="Blog Background"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                console.log('Error loading blog background image, using gradient fallback');
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)';
                }
              }}
              onLoad={() => {
                console.log('Blog background image loaded successfully');
              }}
            />
          </div>
          
          {/* Back Button - Top Left */}
          <div className="absolute top-4 left-4 z-20">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel de Control
            </Button>
          </div>
          
          {/* Content - Bottom Area */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <div className="space-y-3">
              {/* Title */}
              <div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Blog Profesional
                  </h1>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 inline-block max-w-2xl">
                  <p className="text-lg text-white">
                    Conocimiento y tendencias del sector automotriz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <BlogList />
      </div>
    </div>
  );
};

export default BlogMainPage;
