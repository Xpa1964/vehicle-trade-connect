
export interface ImagePreview {
  file: File;
  preview: string;
  isPrimary: boolean;
}

export interface ImageEdit {
  brightness: number;
  contrast: number;
  saturation?: number;
  rotate?: number;
}
