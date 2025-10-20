"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedImageBlob: Blob) => void;
  isUploading?: boolean;
}

const ASPECT_RATIO = 1; // Square crop for avatar

export function AvatarCropModal({
  isOpen,
  onClose,
  imageFile,
  onCropComplete,
  isUploading = false,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize the image URL to prevent re-creation on every render
  const imageUrl = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : null;
  }, [imageFile]);

  const onImageLoad = React.useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    // Only set crop if it doesn't exist yet
    if (!crop) {
      // Create a centered square crop
      const newCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 60, // Use 60% for better visibility
          },
          ASPECT_RATIO,
          width,
          height
        ),
        width,
        height
      );

      setCrop(newCrop);

      // Also set the completed crop in pixels for immediate use
      const pixelCrop: PixelCrop = {
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
        unit: "px",
      };
      setCompletedCrop(pixelCrop);
    }
  }, [crop]);

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop,
  ): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.95);
    });
  };

  const handleCrop = async () => {
    if (!imgRef.current || !completedCrop) return;

    const croppedImageBlob = await getCroppedImg(
      imgRef.current,
      completedCrop,
    );

    if (croppedImageBlob) {
      onCropComplete(croppedImageBlob);
    }
  };

  const handleClose = React.useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  }, [onClose]);

  // Cleanup image URL when component unmounts or image changes
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recortar Imagen de Perfil</DialogTitle>
          <DialogDescription>
            Selecciona la parte de la imagen que quieres usar como avatar. Puedes arrastrar y ajustar el área de recorte.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {imageUrl && (
            <div className="max-w-full max-h-96 overflow-hidden border rounded-lg">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                className="max-w-full max-h-96"
              >
                <Image
                  width={200}
                  height={200}
                  src={imageUrl}
                  alt="Imagen a recortar"
                  className="max-w-full max-h-96 object-contain"
                  ref={imgRef}
                  onLoad={onImageLoad}
                  style={{ display: 'block' }}
                />
              </ReactCrop>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button
            onClick={handleCrop}
            disabled={!completedCrop || isUploading}
          >
            {isUploading ? "Procesando..." : "Aplicar Recorte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
