"use client";

import { AvatarCropModal } from "@/components/AvatarCropModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Upload, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  gym_name: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { status, update: updateSession } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      gym_name: "",
    },
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            form.reset({
              name: data.user.name || "",
              gym_name: data.user.gym_name || "",
            });
            setAvatarUrl(data.user.avatar_url || "");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setIsFetchingProfile(false);
        }
      } else if (status !== "loading") {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError(
        "Tipo de archivo inválido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)"
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Archivo muy grande. El tamaño máximo es 5MB");
      return;
    }

    setSelectedFile(file);
    setShowCropModal(true);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCroppedImage = async (croppedImageBlob: Blob) => {
    setShowCropModal(false);
    setIsUploadingAvatar(true);
    setError("");
    setSelectedFile(null);

    try {
      const formData = new FormData();
      formData.append("file", croppedImageBlob, "avatar.jpg");

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setAvatarUrl(result.avatar_url);
        setSuccess("Avatar actualizado exitosamente");
        // Update session to reflect new avatar
        await updateSession();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Error al subir la imagen");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!avatarUrl) return;

    setIsDeletingAvatar(true);
    setError("");

    try {
      const response = await fetch("/api/user/avatar", {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        setAvatarUrl("");
        setSuccess("Avatar eliminado exitosamente");
        // Update session to reflect avatar removal
        await updateSession();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Error al eliminar la imagen");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Perfil actualizado exitosamente");
        // Update session to reflect new profile data
        await updateSession();
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(result.error || "Error al actualizar el perfil");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if session is loading
  if (status === "loading" || isFetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Configura tu información personal y de tu gimnasio
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="100px"
                      priority
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingAvatar ? "Subiendo..." : "Subir Imagen"}
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarDelete}
                      disabled={isDeletingAvatar}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  JPEG, PNG, GIF o WebP. Máximo 5MB.
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gym_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Gimnasio</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nombre de tu gimnasio (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este nombre aparecerá en los documentos generados
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-950/20 p-3 rounded-md border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-900">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Avatar Crop Modal */}
      <AvatarCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setSelectedFile(null);
        }}
        imageFile={selectedFile}
        onCropComplete={handleCroppedImage}
        isUploading={isUploadingAvatar}
      />
    </div>
  );
}
