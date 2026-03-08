import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HelpCircle, Upload, FileSpreadsheet, AlertTriangle, Camera, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageHelpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageHelpDrawer: React.FC<ImageHelpDrawerProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            {t('vehicles.imageHelp.title')}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="howto" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="howto" className="text-xs sm:text-sm">
              <Upload className="h-3.5 w-3.5 mr-1" />
              {t('vehicles.imageHelp.tab.howTo')}
            </TabsTrigger>
            <TabsTrigger value="bulk" className="text-xs sm:text-sm">
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
              {t('vehicles.imageHelp.tab.bulk')}
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="text-xs sm:text-sm">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {t('vehicles.imageHelp.tab.troubleshoot')}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1 — How to upload */}
          <TabsContent value="howto" className="mt-4 space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('vehicles.imageHelp.formats.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {t('vehicles.imageHelp.formats.accepted')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {t('vehicles.imageHelp.formats.maxSize')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {t('vehicles.imageHelp.formats.maxCount')}
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('vehicles.imageHelp.tips.title')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  {t('vehicles.imageHelp.tips.primaryImage')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  {t('vehicles.imageHelp.tips.reorder')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  {t('vehicles.imageHelp.tips.minPhotos')}
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-foreground text-sm mb-2">{t('vehicles.imageHelp.recommended.title')}</h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                <span>📸 {t('vehicles.imageHelp.recommended.front')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.rear')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.sides')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.dashboard')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.seats')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.trunk')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.engine')}</span>
                <span>📸 {t('vehicles.imageHelp.recommended.wheels')}</span>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2 — Bulk upload */}
          <TabsContent value="bulk" className="mt-4 space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">{t('vehicles.imageHelp.bulk.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('vehicles.imageHelp.bulk.description')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="border rounded-lg p-3 bg-accent/50">
                <h5 className="font-medium text-sm text-foreground mb-1">
                  ✅ {t('vehicles.imageHelp.bulk.option1.title')}
                </h5>
                <p className="text-xs text-muted-foreground">{t('vehicles.imageHelp.bulk.option1.desc')}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">WBA3B5G50DNP26082_1.jpg, WBA3B5G50DNP26082_2.jpg</code>
              </div>

              <div className="border rounded-lg p-3">
                <h5 className="font-medium text-sm text-foreground mb-1">
                  {t('vehicles.imageHelp.bulk.option2.title')}
                </h5>
                <p className="text-xs text-muted-foreground">{t('vehicles.imageHelp.bulk.option2.desc')}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">ABC1234_1.jpg, ABC1234_2.jpg</code>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs text-destructive">
                <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
                {t('vehicles.imageHelp.bulk.noPatternWarning')}
              </p>
            </div>
          </TabsContent>

          {/* Tab 3 — Troubleshooting */}
          <TabsContent value="troubleshoot" className="mt-4 space-y-3">
            <h4 className="font-semibold text-foreground">{t('vehicles.imageHelp.troubleshoot.title')}</h4>

            {[
              { error: 'invalidFormat', icon: '🚫' },
              { error: 'tooLarge', icon: '📦' },
              { error: 'notShowing', icon: '👁️' },
              { error: 'limitReached', icon: '🔢' },
            ].map(({ error, icon }) => (
              <div key={error} className="border rounded-lg p-3 space-y-1">
                <h5 className="font-medium text-sm text-foreground">
                  {icon} {t(`vehicles.imageHelp.troubleshoot.${error}.title`)}
                </h5>
                <p className="text-xs text-muted-foreground">
                  {t(`vehicles.imageHelp.troubleshoot.${error}.solution`)}
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ImageHelpDrawer;
