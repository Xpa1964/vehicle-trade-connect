
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamplesTabsProps {
  translations: {
    examples: {
      title: Record<string, string>;
      gallery: {
        title: Record<string, string>;
        content: Record<string, string>;
      };
      detail: {
        title: Record<string, string>;
        content: Record<string, string>;
      };
      listing: {
        title: Record<string, string>;
        content: Record<string, string>;
      };
    };
  };
  lang: string;
}

const GalleryExampleTabs: React.FC<ExamplesTabsProps> = ({ translations, lang }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {translations.examples.title[lang as keyof typeof translations.examples.title] || translations.examples.title.es}
      </h2>

      <Tabs defaultValue="gallery">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="gallery">
            {translations.examples.gallery.title[lang as keyof typeof translations.examples.gallery.title] || translations.examples.gallery.title.es}
          </TabsTrigger>
          <TabsTrigger value="detail">
            {translations.examples.detail.title[lang as keyof typeof translations.examples.detail.title] || translations.examples.detail.title.es}
          </TabsTrigger>
          <TabsTrigger value="listing">
            {translations.examples.listing.title[lang as keyof typeof translations.examples.listing.title] || translations.examples.listing.title.es}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <img src="/lovable-uploads/9e01aadc-19f3-4b04-abd8-c3e20e65471c.png" alt="Vehicle gallery" className="rounded-lg w-full h-auto" />
                <div className="flex flex-col justify-center">
                  <p className="text-gray-700 mb-6">
                    {translations.examples.gallery.content[lang as keyof typeof translations.examples.gallery.content] || translations.examples.gallery.content.es}
                  </p>
                  <Button 
                    className="w-full md:w-auto flex items-center gap-2 mx-auto"
                    onClick={() => navigate('/vehicle-gallery')}
                  >
                    Explorar Galería
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detail">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div>
                  <img src="/lovable-uploads/692592c1-0d4b-427f-a681-ee86cac1a575.png" alt="Vehicle detail" className="rounded-lg w-full h-auto mb-4" />
                </div>
                <div>
                  <img src="/lovable-uploads/5ba1752c-a796-44be-9b44-eb63cc0ba930.png" alt="Vehicle additional information" className="rounded-lg w-full h-auto mb-4" />
                  <p className="text-gray-700 mt-2">
                    {translations.examples.detail.content[lang as keyof typeof translations.examples.detail.content] || translations.examples.detail.content.es}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="listing">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <img src="/lovable-uploads/3b28aa37-4aeb-4b40-94dd-b5794a86ca77.png" alt="Vehicle listing form" className="rounded-lg w-full h-auto" />
                <div className="flex flex-col justify-center">
                  <p className="text-gray-700 mb-6">
                    {translations.examples.listing.content[lang as keyof typeof translations.examples.listing.content] || translations.examples.listing.content.es}
                  </p>
                  <Button 
                    className="w-full md:w-auto flex items-center gap-2 mx-auto"
                    onClick={() => navigate('/vehicle-management')}
                  >
                    Publicar Vehículo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryExampleTabs;
