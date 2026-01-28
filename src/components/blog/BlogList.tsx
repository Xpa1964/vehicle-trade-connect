
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogList: React.FC = () => {
  const navigate = useNavigate();

  // Datos de ejemplo del blog
  const blogPosts = [
    {
      id: 1,
      title: 'Tendencias del Mercado Automotriz 2024',
      excerpt: 'Análisis completo de las principales tendencias que están definiendo el sector automotriz este año...',
      author: 'Carlos Mendoza',
      date: '2024-01-15',
      image: '/lovable-uploads/eec67196-c0f3-47cb-9620-773175533a94.png',
      category: 'Mercado'
    },
    {
      id: 2,
      title: 'Guía de Importación de Vehículos',
      excerpt: 'Todo lo que necesitas saber sobre los procesos de importación, documentación y costes...',
      author: 'María González',
      date: '2024-01-10',
      image: '/lovable-uploads/ba9a7ade-a335-4687-9895-ed163a824df5.png',
      category: 'Importación'
    },
    {
      id: 3,
      title: 'Tecnologías Emergentes en Vehículos',
      excerpt: 'Las últimas innovaciones tecnológicas que están revolucionando la industria automotriz...',
      author: 'Roberto Silva',
      date: '2024-01-05',
      image: '/lovable-uploads/379e75ed-00ea-49f5-a545-0365e0d9dc22.png',
      category: 'Tecnología'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header de la lista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Últimas Publicaciones</h2>
          <p className="text-gray-600 mt-1">Mantente informado con nuestros artículos especializados</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/blog-view')}>
          Ver todos los artículos
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Lista de artículos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.date).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío si no hay artículos */}
      {blogPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay artículos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Próximamente tendremos contenido especializado para ti.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
