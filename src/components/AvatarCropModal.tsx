"use client";

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
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
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
      <DialogContent
        showCloseButton={false}
        className="rounded-none border-0 bg-floor p-8 text-ink shadow-none sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal tracking-tight text-ink">
            Recortar foto
          </DialogTitle>
          <DialogDescription className="text-ink/70">
            Arrastrá el recuadro para elegir el recorte del avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {imageUrl && (
            <div className="max-h-96 max-w-full overflow-hidden border border-ink/15">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                className="max-h-96 max-w-full"
              >
                <Image
                  width={200}
                  height={200}
                  src={imageUrl}
                  alt="Imagen a recortar"
                  className="max-h-96 max-w-full object-contain"
                  ref={imgRef}
                  onLoad={onImageLoad}
                  style={{ display: "block" }}
                />
              </ReactCrop>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <DialogFooter className="mt-4 gap-3 sm:justify-start">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="cursor-pointer px-1 font-display text-base text-ink/60 hover:text-ink disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCrop}
            disabled={!completedCrop || isUploading}
            className="cursor-pointer bg-tape px-4 py-2 font-display text-base text-on-tape disabled:opacity-50"
          >
            {isUploading ? "Procesando..." : "Aplicar recorte"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
