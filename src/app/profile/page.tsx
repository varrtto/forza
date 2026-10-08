"use client";

import { AvatarCropModal } from "@/components/AvatarCropModal";
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

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Archivo muy grande. El tamaño máximo es 5MB");
      return;
    }

    setSelectedFile(file);
    setShowCropModal(true);

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
        setSuccess("Logo actualizado");
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
        setSuccess("Logo eliminado");
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
        setSuccess("Perfil actualizado");
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

  if (status === "loading" || isFetchingProfile) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-ink/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Perfil
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">
          Tu nombre, el del gimnasio y el logo que sale en las rutinas.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-10 flex flex-col gap-6"
          >
            <div>
              <p className="font-display text-base text-ink">Logo</p>
              <div className="mt-3 flex items-center gap-5">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-ink">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Logo del gimnasio"
                      fill
                      className="object-cover"
                      sizes="96px"
                      priority
                    />
                  ) : (
                    <User className="h-10 w-10 text-floor" />
                  )}
                </div>
                <div className="min-w-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isUploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex h-10 items-center gap-2 font-display text-base text-ink underline decoration-tape decoration-2 underline-offset-4 disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingAvatar ? "Subiendo..." : "Subir imagen"}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={isDeletingAvatar}
                        aria-label="Eliminar logo"
                        className="inline-flex h-10 items-center text-ink/40 transition-colors hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink/55">
                    JPEG, PNG, GIF o WebP. Máximo 5MB.
                  </p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      className={fieldClass}
                      {...field}
                    />
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
                  <FormLabel className={labelClass}>
                    Nombre del gimnasio
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Opcional"
                      className={fieldClass}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-ink/55">
                    Sale en las rutinas que generás.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-ink">{success}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-12 items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </Form>
      </div>

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
