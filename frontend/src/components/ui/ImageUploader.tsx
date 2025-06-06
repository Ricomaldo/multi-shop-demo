import { Box, Text, useColorModeValue, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<string>;
  currentImageUrl?: string;
  onError?: (error: Error) => void;
}

export default function ImageUploader({
  onImageUpload,
  currentImageUrl,
  onError,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        await onImageUpload(file);
        toast({
          title: "Image téléchargée",
          description: "L'image a été optimisée et sauvegardée avec succès",
          status: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        toast({
          title: "Erreur",
          description:
            error instanceof Error
              ? error.message
              : "Erreur lors du téléchargement",
          status: "error",
          duration: 5000,
        });
        onError?.(
          error instanceof Error ? error : new Error("Erreur inconnue")
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload, toast, onError]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_IMAGE_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: false,
    });

  // Gestion des erreurs de validation
  if (fileRejections.length > 0) {
    const errorMessage = fileRejections[0]?.errors[0]?.message;
    if (errorMessage) {
      toast({
        title: "Format non valide",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    }
  }

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor={isDragActive ? "blue.400" : borderColor}
      borderRadius="lg"
      p={6}
      textAlign="center"
      cursor="pointer"
      bg={isDragActive ? "blue.50" : bgColor}
      transition="all 0.2s"
      _hover={{
        borderColor: "blue.400",
        bg: "blue.50",
      }}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <Text color={textColor}>Téléchargement en cours...</Text>
      ) : currentImageUrl ? (
        <Box>
          <img
            src={currentImageUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
          <Text color={textColor}>
            Glissez-déposez une nouvelle image ou cliquez pour changer
          </Text>
        </Box>
      ) : (
        <Box>
          <Text color={textColor} mb={2}>
            Glissez-déposez une image ici, ou cliquez pour sélectionner
          </Text>
          <Text fontSize="sm" color={textColor}>
            Formats acceptés : JPG, PNG, WebP (max 5MB)
          </Text>
        </Box>
      )}
    </Box>
  );
}
